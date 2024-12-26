import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.43.124:5000';

export default function App() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [days, setDays] = useState('7');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const validateInputs = useCallback(() => {
    if (!owner.trim()) {
      setError('Repository owner is required');
      return false;
    }
    if (!repo.trim()) {
      setError('Repository name is required');
      return false;
    }
    if (isNaN(Number(days)) || Number(days) < 1) {
      setError('Please enter a valid number of days');
      return false;
    }
    return true;
  }, [owner, repo, days]);

  const getSummary = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post(`${API_URL}/summarize`, {
        owner: owner.trim(),
        repo: repo.trim(),
        days: Number(days)
      });

      setSummary(response.data.summary);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        'Error fetching summary. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>GitHub Commit Summarizer</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Repository Owner</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., facebook"
            value={owner}
            onChangeText={text => {
              setError('');
              setOwner(text);
            }}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Repository Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., react"
            value={repo}
            onChangeText={text => {
              setError('');
              setRepo(text);
            }}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Days to Analyze</Text>
          <TextInput
            style={styles.input}
            placeholder="7"
            value={days}
            onChangeText={text => {
              setError('');
              setDays(text);
            }}
            keyboardType="numeric"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={getSummary}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Summary</Text>
          )}
        </TouchableOpacity>

        {summary ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Commit Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  summaryContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});