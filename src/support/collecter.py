import os
import json
import tkinter as tk
from tkinter import filedialog

def select_folder():
    # Create a hidden root window
    root = tk.Tk()
    root.withdraw()  # Hide the root window

    # Open the folder selection dialog
    folder_path = filedialog.askdirectory(title="Select a Folder")
    
    return folder_path

def get_file_size(file_path):
    """Returns the size of the file in bytes."""
    return os.path.getsize(file_path)

def build_file_tree(directory):
    """Builds a hierarchical tree structure of files and folders."""
    item = {
        "name": os.path.basename(directory),
        "children": [],
        "size": 0
    }

    try:
        # Iterate through the directory
        for entry in os.scandir(directory):
            if entry.is_file():
                file_size = get_file_size(entry.path)
                item["children"].append({
                    "name": entry.name,
                    "size": file_size
                })
                item["size"] += file_size  # Accumulate the size for the folder
            elif entry.is_dir():
                # Recursively build the tree for subdirectories
                subfolder = build_file_tree(entry.path)
                item["children"].append(subfolder)
                item["size"] += subfolder["size"]  # Add subfolder size

    except PermissionError:
        # Handle any permission errors gracefully
        print(f"Permission denied: {directory}")
    
    return item

def save_to_json(data, output_file):
    """Saves the hierarchical data to a JSON file."""
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    root_directory = select_folder()  # Select desired folder
    output_file = "file_system_data.json"
    
    file_tree = build_file_tree(root_directory)
    save_to_json(file_tree, output_file)
    
    print(f"File system data saved to {output_file}")
