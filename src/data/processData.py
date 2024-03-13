import pandas as pd
import json

# Define the path to your input and output JSON files
input_json_path = 'src/data/menuData.json'  # Update this to your actual input file path
output_json_path = 'processed_data.json'    # The path where you want to save the processed file

# Read the JSON file into a DataFrame
data = pd.read_json(input_json_path)

# Filter the columns you want to keep and explicitly create a copy
filtered_data = data[['ItemID', 'Description', 'Alternative_Description', 'Category']].copy()

# Rename the columns
filtered_data.rename(columns={'Description': 'EnDescription', 'Alternative_Description': 'ChnDescription'}, inplace=True)

# Convert the DataFrame to a list of dictionaries
records = filtered_data.to_dict(orient='records')

# Write the list of dictionaries to a JSON file with commas after each dictionary
with open(output_json_path, 'w', encoding='utf-8') as f:
    f.write('[\n')
    for i, record in enumerate(records):
        # Convert the dictionary to a JSON string
        json_record = json.dumps(record, ensure_ascii=False)
        # Add a comma after each record except the last one
        if i < len(records) - 1:
            json_record += ','
        f.write(json_record + '\n')
    f.write(']')

print(f'Processed data has been saved to {output_json_path}')
