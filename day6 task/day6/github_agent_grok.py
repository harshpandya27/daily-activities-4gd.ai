import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests
from collections import defaultdict

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
app = Flask(__name__)
CORS(app)

def format_commit_info(commit):
    return {
        'message': commit['commit']['message'],
        'author': commit['commit']['author']['name'],
        'date': commit['commit']['author']['date'],
        'files_changed': len(commit.get('files', [])) if 'files' in commit else 0
    }

def group_commits_by_date(commits):
    date_groups = defaultdict(list)
    
    for commit in commits:
        date = datetime.strptime(commit['commit']['author']['date'], 
                               '%Y-%m-%dT%H:%M:%SZ').strftime('%Y-%m-%d')
        date_groups[date].append(format_commit_info(commit))
    
    return dict(sorted(date_groups.items(), reverse=True))

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.json
        owner = data.get("owner")
        repo = data.get("repo")
        days = int(data.get("days", 7))
        
        # Get commits with detailed info
        url = f"https://api.github.com/repos/{owner}/{repo}/commits"
        headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
        since_date = (datetime.now() - timedelta(days=days)).isoformat()
        params = {"since": since_date, "per_page": 100}
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            return jsonify({
                "error": "GitHub API error",
                "message": response.text
            }), response.status_code
            
        commits = response.json()
        
        # Get detailed information for each commit
        detailed_commits = []
        for commit in commits:
            commit_url = commit['url']
            detailed_response = requests.get(commit_url, headers=headers)
            if detailed_response.status_code == 200:
                detailed_commits.append(detailed_response.json())
        
        # Group and analyze commits
        grouped_commits = group_commits_by_date(detailed_commits)
        
        # Generate summary statistics
        summary_stats = {
            "total_commits": len(commits),
            "unique_authors": len(set(c['commit']['author']['name'] for c in commits)),
            "date_range": {
                "from": since_date.split('T')[0],
                "to": datetime.now().strftime('%Y-%m-%d')
            }
        }
        
        return jsonify({
            "summary_stats": summary_stats,
            "commits_by_date": grouped_commits
        })
        
    except Exception as e:
        logger.error(f"Error in summarize endpoint: {str(e)}")
        return jsonify({
            "error": "Error generating summary",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)