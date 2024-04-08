import json
from opencc import OpenCC

def convert_to_traditional_chinese(text):
    cc = OpenCC('s2t')  # Initialize the converter
    return cc.convert(text)

def clean_json_data(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    seen = set()
    cleaned_data = []
    for item in data:

        traditional_text = convert_to_traditional_chinese(item['ChnDescription'].strip())
        if traditional_text not in seen:
            item['ChnDescription'] = traditional_text
            cleaned_data.append(item)
            seen.add(traditional_text)

    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(cleaned_data, file, ensure_ascii=False, indent=4)

    print(f"Data cleaned and written to {output_file}. Total items: {len(cleaned_data)}")

# Usage
input_file = 'src/data/processed_data.json'
output_file = 'cleaned_data.json'
clean_json_data(input_file, output_file)
