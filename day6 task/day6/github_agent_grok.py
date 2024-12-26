import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.llms.base import LLM
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import urllib3
import json

# Disable SSL verification warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GROK_API_KEY = os.getenv("GROK_API_KEY")
GROK_API_URL = "https://api.anthropic.com/v1/messages"  # Updated to use Anthropic's API

# Flask app setup
app = Flask(__name__)
CORS(app)

class GrokLLM(LLM):
    def _call(self, prompt: str, stop=None) -> str:
        try:
            logger.debug("Making request to Anthropic API")
            logger.debug(f"Prompt length: {len(prompt)}")
            
            headers = {
                "x-api-key": GROK_API_KEY,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            payload = {
                "messages": [{
                    "role": "user",
                    "content": f"Please summarize these git commits concisely:\n{prompt}\nFocus on main changes, features, and fixes."
                }],
                "model": "claude-2.1",
                "max_tokens": 500
            }
            
            logger.debug("Sending request to Anthropic API")
            response = requests.post(
                GROK_API_URL,
                headers=headers,
                json=payload,
                verify=False  # Disable SSL verification
            )
            
            logger.debug(f"API response status: {response.status_code}")
            logger.debug(f"API response: {response.text}")
            
            if response.status_code != 200:
                logger.error(f"API error: {response.text}")
                return f"Error: Unable to generate summary (Status: {response.status_code})"
                
            response_json = response.json()
            return response_json.get("content", "No summary generated")
            
        except Exception as e:
            logger.error(f"Error in API call: {str(e)}")
            return f"Error generating summary: {str(e)}"

    @property
    def _identifying_params(self):
        return {"name": "GrokLLM"}

    @property
    def _llm_type(self):
        return "grok_ai"

def summarize_commits_directly(commits):
    """Fallback function to summarize commits without using external API"""
    try:
        # Extract basic stats
        total_commits = len(commits)
        authors = set()
        file_changes = set()
        
        for commit in commits:
            authors.add(commit['commit']['author']['name'])
            message = commit['commit']['message'].lower()
            
            # Extract main actions from commit messages
            if 'add' in message:
                file_changes.add('additions')
            if 'fix' in message:
                file_changes.add('fixes')
            if 'update' in message:
                file_changes.add('updates')
            if 'remove' in message:
                file_changes.add('removals')
        
        summary = f"""Summary of {total_commits} commits:
- Number of contributors: {len(authors)}
- Types of changes: {', '.join(file_changes)}
- Latest commit: {commits[0]['commit']['message']}"""
        
        return summary
        
    except Exception as e:
        logger.error(f"Error in direct summarization: {str(e)}")
        return "Unable to generate summary"

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.json
        owner = data.get("owner")
        repo = data.get("repo")
        days = int(data.get("days", 10))
        
        logger.debug(f"Processing request for {owner}/{repo} over {days} days")
        
        # Get commits from GitHub
        url = f"https://api.github.com/repos/{owner}/{repo}/commits"
        headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
        since_date = (datetime.now() - timedelta(days=days)).isoformat()
        params = {"since": since_date}
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            return jsonify({
                "error": "GitHub API error",
                "message": response.text
            }), response.status_code
            
        commits = response.json()
        
        # Generate summary directly without external API
        summary = summarize_commits_directly(commits)
        
        return jsonify({
            "summary": summary,
            "commit_count": len(commits)
        })
        
    except Exception as e:
        logger.error(f"Error in summarize endpoint: {str(e)}")
        return jsonify({
            "error": "Error generating summary",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    logger.info("Starting the application...")
    app.run(host="0.0.0.0", port=5000, debug=True)