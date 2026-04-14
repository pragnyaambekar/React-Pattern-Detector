#!/usr/bin/env python3
"""
Confusion Matrix Analysis
Shows detailed breakdown of detector predictions vs human reviews
"""

import csv
from collections import defaultdict

# Read the validation tracking CSV with both reviews
with open('Reviewer form - Sheet1.csv', 'r') as f:
    reader = csv.DictReader(f)
    data = list(reader)

def normalize_rating(rating):
    """Normalize review ratings to Major/Minor/Clean"""
    rating = rating.strip()
    if 'Major' in rating:
        return 'Major'
    elif 'Minor' in rating:
        return 'Minor'
    elif 'Clean' in rating:
        return 'Clean'
    return rating

# Build confusion matrices
def build_confusion_matrix(data, review_column):
    """Build confusion matrix for detector vs reviewer"""
    matrix = defaultdict(lambda: defaultdict(int))
    details = defaultdict(lambda: defaultdict(list))
    
    for row in data:
        detector = row['Severity']
        review = normalize_rating(row[review_column])
        matrix[detector][review] += 1
        details[detector][review].append({
            'component': row['Component Name'],
            'pattern': row['Pattern'],
            'metrics': row['Metrics']
        })
    
    return matrix, details

# Analysis
print("=" * 80)
print("CONFUSION MATRIX ANALYSIS")
print("=" * 80)
print()

# 1. Reviewer 1 Confusion Matrix
print("=" * 80)
print("📊 CONFUSION MATRIX - DETECTOR vs REVIEWER 1")
print("=" * 80)
print()

r1_matrix, r1_details = build_confusion_matrix(data, 'Review 1  Rating')

# Print matrix
categories = ['Major', 'Minor', 'Clean']
detector_levels = ['Extreme', 'Severe', 'Moderate']

print(f"{'Detector ↓':<15} {'Major':<10} {'Minor':<10} {'Clean':<10} {'Total':<10}")
print("-" * 55)

for detector in detector_levels:
    row_str = f"{detector:<15}"
    total = 0
    for category in categories:
        count = r1_matrix[detector][category]
        total += count
        row_str += f"{count:<10}"
    row_str += f"{total:<10}"
    print(row_str)

# Print totals
print("-" * 55)
total_str = f"{'Total':<15}"
grand_total = 0
for category in categories:
    col_total = sum(r1_matrix[detector][category] for detector in detector_levels)
    total_str += f"{col_total:<10}"
    grand_total += col_total
total_str += f"{grand_total:<10}"
print(total_str)
print()

# Show details for key cells
print("DETAILED BREAKDOWN - Reviewer 1:")
print()

print("CORRECT PREDICTIONS:")
print()
print("  Extreme → Major (Should be Major):")
for item in r1_details['Extreme']['Major'][:3]:
    print(f"    • {item['component']:<25} {item['pattern']}")
print(f"    ... and {len(r1_details['Extreme']['Major'])} total")
print()

print("  Severe → Major/Minor (Should be Major or Minor):")
severe_correct = len(r1_details['Severe']['Major']) + len(r1_details['Severe']['Minor'])
print(f"    {severe_correct} components correctly flagged as having issues")
print()

print(" FALSE POSITIVES:")
print()
if r1_matrix['Extreme']['Minor'] > 0:
    print(f"  Extreme → Minor ({r1_matrix['Extreme']['Minor']} cases):")
    for item in r1_details['Extreme']['Minor']:
        print(f"    • {item['component']:<25} {item['pattern']:<20} {item['metrics']}")
    print()

if r1_matrix['Extreme']['Clean'] > 0:
    print(f"  Extreme → Clean ({r1_matrix['Extreme']['Clean']} cases):")
    for item in r1_details['Extreme']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']:<20} {item['metrics']}")
    print()

if r1_matrix['Severe']['Clean'] > 0:
    print(f"  Severe → Clean ({r1_matrix['Severe']['Clean']} cases):")
    for item in r1_details['Severe']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']:<20} {item['metrics']}")
    print()

# 2. Reviewer 2 Confusion Matrix
print("=" * 80)
print("📊 CONFUSION MATRIX - DETECTOR vs REVIEWER 2")
print("=" * 80)
print()

r2_matrix, r2_details = build_confusion_matrix(data, 'Reviewer 2 Rating')

# Print matrix
print(f"{'Detector ↓':<15} {'Major':<10} {'Minor':<10} {'Clean':<10} {'Total':<10}")
print("-" * 55)

for detector in detector_levels:
    row_str = f"{detector:<15}"
    total = 0
    for category in categories:
        count = r2_matrix[detector][category]
        total += count
        row_str += f"{count:<10}"
    row_str += f"{total:<10}"
    print(row_str)

# Print totals
print("-" * 55)
total_str = f"{'Total':<15}"
grand_total = 0
for category in categories:
    col_total = sum(r2_matrix[detector][category] for detector in detector_levels)
    total_str += f"{col_total:<10}"
    grand_total += col_total
total_str += f"{grand_total:<10}"
print(total_str)
print()

# Show details for key cells
print(" DETAILED BREAKDOWN - Reviewer 2:")
print()

print(" FALSE POSITIVES:")
print()
if r2_matrix['Extreme']['Minor'] > 0:
    print(f"  Extreme → Minor ({r2_matrix['Extreme']['Minor']} cases):")
    for item in r2_details['Extreme']['Minor'][:5]:
        print(f"    • {item['component']:<25} {item['pattern']:<20}")
    if len(r2_details['Extreme']['Minor']) > 5:
        print(f"    ... and {len(r2_details['Extreme']['Minor']) - 5} more")
    print()

if r2_matrix['Extreme']['Clean'] > 0:
    print(f"  Extreme → Clean ({r2_matrix['Extreme']['Clean']} cases):")
    for item in r2_details['Extreme']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']:<20} {item['metrics']}")
    print()

if r2_matrix['Severe']['Clean'] > 0:
    print(f"  Severe → Clean ({r2_matrix['Severe']['Clean']} cases):")
    for item in r2_details['Severe']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']:<20} {item['metrics']}")
    print()

# 3. Consensus Confusion Matrix
print("=" * 80)
print(" CONFUSION MATRIX - DETECTOR vs CONSENSUS (Both Reviewers Agree)")
print("=" * 80)
print()

consensus_matrix = defaultdict(lambda: defaultdict(int))
consensus_details = defaultdict(lambda: defaultdict(list))

for row in data:
    r1 = normalize_rating(row['Review 1  Rating'])
    r2 = normalize_rating(row['Reviewer 2 Rating'])
    
    if r1 == r2:  # Consensus
        detector = row['Severity']
        consensus_matrix[detector][r1] += 1
        consensus_details[detector][r1].append({
            'component': row['Component Name'],
            'pattern': row['Pattern'],
            'metrics': row['Metrics'],
            'r1_notes': row['Review 1  Notes'],
            'r2_notes': row['Reviewer 2  Notes']
        })

# Print consensus matrix
print(f"{'Detector ↓':<15} {'Major':<10} {'Minor':<10} {'Clean':<10} {'Total':<10}")
print("-" * 55)

for detector in detector_levels:
    row_str = f"{detector:<15}"
    total = 0
    for category in categories:
        count = consensus_matrix[detector][category]
        total += count
        row_str += f"{count:<10}"
    row_str += f"{total:<10}"
    print(row_str)

# Print totals
print("-" * 55)
total_str = f"{'Total':<15}"
grand_total = 0
for category in categories:
    col_total = sum(consensus_matrix[detector][category] for detector in detector_levels)
    total_str += f"{col_total:<10}"
    grand_total += col_total
total_str += f"{grand_total:<10}"
print(total_str)
print()

print("📋 CONSENSUS FALSE POSITIVES (Both reviewers agree detector is wrong):")
print()

# Extreme → not Major
if consensus_matrix['Extreme']['Minor'] > 0 or consensus_matrix['Extreme']['Clean'] > 0:
    print("  Extreme → Minor/Clean:")
    for item in consensus_details['Extreme']['Minor'] + consensus_details['Extreme']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']}")
        print(f"      R1: {item['r1_notes'][:60]}")
        print(f"      R2: {item['r2_notes'][:60]}")
        print()

# Severe → Clean
if consensus_matrix['Severe']['Clean'] > 0:
    print("  Severe → Clean:")
    for item in consensus_details['Severe']['Clean']:
        print(f"    • {item['component']:<25} {item['pattern']}")
        print(f"      R1: {item['r1_notes'][:60]}")
        print(f"      R2: {item['r2_notes'][:60]}")
        print()

# 4. Summary Statistics
print("=" * 80)
print(" SUMMARY STATISTICS")
print("=" * 80)
print()

# Calculate metrics for each reviewer
def calculate_metrics(matrix):
    """Calculate precision, recall, etc."""
    # For Extreme: TP = Major, FP = Minor+Clean
    extreme_tp = matrix['Extreme']['Major']
    extreme_fp = matrix['Extreme']['Minor'] + matrix['Extreme']['Clean']
    
    # For Severe: TP = Major+Minor, FP = Clean
    severe_tp = matrix['Severe']['Major'] + matrix['Severe']['Minor']
    severe_fp = matrix['Severe']['Clean']
    
    total_tp = extreme_tp + severe_tp
    total_fp = extreme_fp + severe_fp
    
    precision = (total_tp / (total_tp + total_fp) * 100) if (total_tp + total_fp) > 0 else 0
    
    return {
        'extreme_tp': extreme_tp,
        'extreme_fp': extreme_fp,
        'severe_tp': severe_tp,
        'severe_fp': severe_fp,
        'total_tp': total_tp,
        'total_fp': total_fp,
        'precision': precision
    }

r1_metrics = calculate_metrics(r1_matrix)
r2_metrics = calculate_metrics(r2_matrix)
consensus_metrics = calculate_metrics(consensus_matrix)

print(f"{'Metric':<25} {'Reviewer 1':<15} {'Reviewer 2':<15} {'Consensus':<15}")
print("-" * 70)
print(f"{'Extreme TP':<25} {r1_metrics['extreme_tp']:<15} {r2_metrics['extreme_tp']:<15} {consensus_metrics['extreme_tp']:<15}")
print(f"{'Extreme FP':<25} {r1_metrics['extreme_fp']:<15} {r2_metrics['extreme_fp']:<15} {consensus_metrics['extreme_fp']:<15}")
print(f"{'Severe TP':<25} {r1_metrics['severe_tp']:<15} {r2_metrics['severe_tp']:<15} {consensus_metrics['severe_tp']:<15}")
print(f"{'Severe FP':<25} {r1_metrics['severe_fp']:<15} {r2_metrics['severe_fp']:<15} {consensus_metrics['severe_fp']:<15}")
print("-" * 70)
print(f"{'Total TP':<25} {r1_metrics['total_tp']:<15} {r2_metrics['total_tp']:<15} {consensus_metrics['total_tp']:<15}")
print(f"{'Total FP':<25} {r1_metrics['total_fp']:<15} {r2_metrics['total_fp']:<15} {consensus_metrics['total_fp']:<15}")
print(f"{'Precision':<25} {r1_metrics['precision']:.1f}%{'':<10} {r2_metrics['precision']:.1f}%{'':<10} {consensus_metrics['precision']:.1f}%")
print()

print("=" * 80)
print("Analysis complete! 🎉")
print("=" * 80)
