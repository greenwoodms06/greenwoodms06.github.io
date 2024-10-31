---
title: "UE5: Python API"
date: 2024-10-31
categories:
  - blog
tags:
  - unreal-engine
  - how-to
  - python
---

This post provides some strategies for renaming Unreal Engine Python scripting.

# List Project Assets
```
def print_project_assets():
    """
    Lists and prints all assets within the project's main content directory.
    
    Returns:
    - None
    """
    # Loop through each asset found in the specified path
    for asset in unreal.EditorAssetLibrary.list_assets("/Game/", recursive=True):
        print(asset)
```

# Data Asset: Create and set variables

```
def create_data_asset(asset_name, asset_path, asset_class_path, properties, no_prompt=True):
    """
    Generalized function to create a Data Asset of a specified class at a given path,
    setting properties based on provided input.

    Parameters:
    - asset_name (str): Name of the new asset.
    - asset_path (str): Path where the asset will be created.
    - asset_class_path (str): Path to the asset class to be used for this asset.
    - properties (list of tuples): List of properties to set on the asset in the format
      [(property_name, property_value), ...].
    - no_prompt (bool): =True to overwrite existing assets without a prompt in editor

    Returns:
    - None
    """
    
    if no_prompt:
        # Get the full asset path (combining asset path and asset name)
        full_asset_path = f"{asset_path}/{asset_name}"
        
        # Check if an asset already exists at the specified path
        if unreal.EditorAssetLibrary.does_asset_exist(full_asset_path):
            # Delete the existing asset to prevent overwrite prompt
            unreal.EditorAssetLibrary.delete_asset(full_asset_path)
            unreal.log(f"Existing asset deleted at {full_asset_path}")
        
    # Get the Asset Tools instance to manage asset creation and editing in the editor.
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()

    # Initialize the factory for creating Data Assets.
    factory = unreal.DataAssetFactory()

    # Attempt to load the asset class using its path
    asset_class = unreal.load_class(None, asset_class_path)
    
    # Check if the asset class was loaded successfully
    if not asset_class:
        unreal.log_error("Could not load asset class.")
        return
    
    # Create the asset using the asset tools, providing the asset name, path, class, and factory.
    asset = asset_tools.create_asset(asset_name, asset_path, asset_class, factory)
    
    # Check if asset creation was successful
    if not asset:
        unreal.log_error(f"Failed to create asset: {asset_name}")
        return
    
    # Set properties from the properties list on the asset.
    for property_name, property_value in properties:
        try:
            asset.set_editor_property(property_name, property_value)
        except Exception as e:
            unreal.log_warning(f"Failed to set property '{property_name}' with value '{property_value}': {e}")

    # Save the asset to make the changes permanent in the editor's content library.
    unreal.EditorAssetLibrary.save_asset(asset.get_path_name())
    unreal.log(f"Created asset: {asset_name} at {asset.get_path_name()} with custom properties.")
```

# Create asset from .obj or structure from csv or json

```
def import_file(fpath, dpath, struct=None):
    ''' where struct is a structure existing in UE project else assume object'''
    print(dpath)
    task = unreal.AssetImportTask()
    task.filename = fpath
    task.destination_path = dpath
    task.replace_existing = True
    task.automated = True
    task.save = False
    
    if '.obj' in fpath:
        task.options = unreal.FbxImportUI()
        task.options.import_materials = False
        task.options.import_textures = False

    if struct != None:
        if '.csv' in fpath:
            factory = unreal.CSVImportFactory()   
        elif '.json' in fpath:
            factory = unreal.ReimportDataTableFactory()
            
        factory.automated_import_settings.import_row_struct = unreal.load_object(None, struct)
        task.factory = factory
     
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    asset_tools.import_asset_tasks([task])
```