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

const API_URL = 'http://172.20.10.10:5000';

export default function App() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [days, setDays] = useState('7');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState('');

  const validateInputs = useCallback(() => {
    if (!owner.trim() || !repo.trim() || isNaN(Number(days)) || Number(days) < 1) {
      setError('Please fill all fields correctly');
      return false;
    }
    return true;
  }, [owner, repo, days]);

  const getSummary = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError('');
    setSummaryData(null);

    try {
      const response = await axios.post(`${API_URL}/summarize`, {
        owner: owner.trim(),
        repo: repo.trim(),
        days: Number(days)
      });
      setSummaryData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching summary');
      Alert.alert('Error', error.response?.data?.message || 'Error fetching summary');
    } finally {
      setLoading(false);
    }
  };

  const renderCommitsByDate = () => {
    if (!summaryData?.commits_by_date) return null;

    return Object.entries(summaryData.commits_by_date).map(([date, commits]) => (
      <View key={date} style={styles.dateGroup}>
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeader}>{date}</Text>
          <Text style={styles.commitCount}>{commits.length} commits</Text>
        </View>
        {commits.map((commit, index) => (
          <View key={index} style={styles.commitItem}>
            <Text style={styles.commitMessage} numberOfLines={2}>{commit.message}</Text>
            <View style={styles.commitMetaContainer}>
              <Text style={styles.authorText}>{commit.author}</Text>
              <Text style={styles.filesChanged}>{commit.files_changed} files</Text>
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>GitHub Commit Analyzer</Text>
      
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Repository Owner"
            value={owner}
            onChangeText={setOwner}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Repository Name"
            value={repo}
            onChangeText={setRepo}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.daysInput]}
            placeholder="Days to analyze"
            value={days}
            onChangeText={setDays}
            keyboardType="numeric"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={getSummary}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Analyze</Text>
          )}
        </TouchableOpacity>
      </View>

      {summaryData && (
        <View style={styles.resultsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summaryData.summary_stats.total_commits}</Text>
              <Text style={styles.statLabel}>Commits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summaryData.summary_stats.unique_authors}</Text>
              <Text style={styles.statLabel}>Contributors</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{days}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
          {renderCommitsByDate()}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1f36',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  daysInput: {
    width: '50%',
  },
  button: {
    backgroundColor: '#0366d6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
    fontSize: 14,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0366d6',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1f36',
  },
  commitCount: {
    fontSize: 14,
    color: '#64748b',
  },
  commitItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commitMessage: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  commitMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: '#64748b',
  },
  filesChanged: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  }
});