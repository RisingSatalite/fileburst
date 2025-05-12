import os
import json
import tkinter as tk
from tkinter import filedialog

#pyinstaller --onefile src/support/layer.py

MAX_RECURSION_DEPTH = 5  # You can change this to control how deep the scan goes

def select_folder():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askdirectory(title="Select a Folder")

def get_file_size(file_path):
    return os.path.getsize(file_path)

def get_folder_size(folder_path):
    """Calculate the total size of a folder without recursing into subdirectories."""
    total_size = 0
    try:
        for entry in os.scandir(folder_path):
            try:
                if entry.is_file():
                    total_size += get_file_size(entry.path)
                elif entry.is_dir():
                    # Only count the directory itself, not its contents
                    total_size += 0  # Optionally skip or estimate
            except (FileNotFoundError, PermissionError):
                pass
    except (FileNotFoundError, PermissionError):
        pass
    return total_size

def build_file_tree(directory, depth=0):
    item = {
        "name": os.path.basename(directory),
        "children": [],
        "size": 0
    }

    try:
        for entry in os.scandir(directory):
            try:
                if entry.is_file():
                    size = get_file_size(entry.path)
                    print(entry.path)
                    item["children"].append({"name": entry.name, "size": size})
                    item["size"] += size
                elif entry.is_dir():
                    if depth < MAX_RECURSION_DEPTH:
                        subfolder = build_file_tree(entry.path, depth + 1)
                        print(entry.path)
                    else:
                        size = get_folder_size(entry.path)
                        subfolder = {"name": entry.name, "size": size, "children": []}
                    item["children"].append(subfolder)
                    item["size"] += subfolder["size"]
            except (FileNotFoundError, PermissionError):
                print(f"Error accessing: {entry.path}")
    except (FileNotFoundError, PermissionError):
        print(f"Error accessing: {directory}")
    
    return item

def save_to_json(data, output_file):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    root_directory = select_folder()
    output_file = "file_system_data.json"
    
    file_tree = build_file_tree(root_directory)
    save_to_json(file_tree, output_file)
    
    print(f"File system data saved to {output_file}")
