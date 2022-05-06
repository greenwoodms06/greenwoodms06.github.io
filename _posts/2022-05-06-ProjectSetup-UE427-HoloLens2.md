# Setting Up an AR/HoloLens 2 Project

## Getting Ready For Unreal Engine
- Download Visual Studio 2019 Community Edition
	- Once installed, launch Visual Studio Installer and modify VS2019
		- Select the following packages:
			- Desktop Development with C++
            - Game Development with C++
            - .NET desktop development (**may not be needed**)
			- Universal Windows Development Platform (**may not be needed**)
            - Mobile Development with .NET (**may not be needed**)
            - .NET cross-platform development (**may not be needed**)
		- 	Under Individual Components, search for "ARM64" 
			- C++ Universal Windows Platform support for v142 build tools (ARM64) (**enable**)
			- MSVC v142 - VS 2019 C++ ARM64 build tools (Latest) (**enable**)

## Setting Up Unreal Engine
- Download Unreal Engine 4.27+. Once installed select Options under the arrow symbol
	- `Target Platforms >`
		- HoloLens 2 (**enable**)

## Setting Up the Unreal Engine Augmented Reality (AR) Project
1. Start Unreal Engine
	- (**Recommended**) Select the template `Architecture, Engineering, and Construction > HoloLens Viewer` with options
		- No Starter Content
		- Ray Tracing Disabled
	- If not using the template, select a blank C++ project with the same options as above and "Scalable/Mobile"
	- Name project as desired and open the project
		- **Note: This may take a while the first time the project is started**
1. Setup Project Folders and Contents
    - Add "Content/Main" folder
        - Add "Main/Maps" folder and create a level named "Main"
        - From the "Place Actors" panel add a light source (e.g, Directional Light) and an object (e.g., Cube) for testing purposes
            - Recommend setting the Cube to "Movable" to remove build lighting warnings.
    - Under "Main" folder add `Miscellaneous>Data Asset>ARSessionConfig` and rename it "AR_SessionConfig"
    - Add "Main/Blueprint" folder
        - Add "Blueprint/Pawns" folder create `Blueprint Class>Pawn`, rename it "BP_Pawn", and open BP_Pawn
            - Add "Start AR Session" to Event > Begin Play
            - Add "Stop AR Session" to Event > End Play
            - Add other capabilities as desired (e.g., head orientation tracking, eye gaze tracking, hand indicators)
    - Add "Main/Core" folder and add `Blueprint Class> Game Mode Base` and rename it "GM_HoloLens"
        - Open and set "Default Pawn Class" to BP_Pawn
    - Delete folders: "CollaborativeViewer" and "HoloLens_BP"
1. Project Settings
	- `Project > Description >`
		- Start in VR (enable)
		- Company Distinguished Name "CN=YOURNAME"
		- Company Name "YOURNAME"
		- Project Name "YOUR CHOICE"
	- `Project > Maps & Modes >`
		- Default GameMode to "GM_HoloLens"
		- Change "Editor Startup Map" and "Game Default Map" to "Main"
	- `Engine > Rendering >`
		- Forward Shading (**enable**)
	- `Platforms > Hololens >`
		- Build for HoloLens Device (**enable**)
		- Auto Increment Version (**enable**)
		- Signing Certificate select "Generate New" (select "none" for password unless a password is desired)
		- Auto-detect Windows 10 SDK (**enable**)
		- Gaze Input (**enable**)
	- `Platforms > Windows Mixed Reality >`
		- Enable Remoting for Editor (**enable**)
			- Requires restart before it can be used
		- IP of HoloLens to remote to: IP address from HoloLens (may change on occasion)
			- From Microsoft Store install the "Holographic Remooting Player" application
			- Launch Holographic Remoting App and enter displayed IP address
		- After restart, launching the Holographic Remoting App on the HoloLens 2, verifying the IP address, and the selecting "Connect" will pair with the HoloLens 2. The project can then be remoted to the HoloLens by selecting "Play > VR Preview" in the editor.
			- UE5.0.1: editor crashing upon pushing "Connect"
	- If not already done, restart the editor
		- **Note: This may take a while the first time the project is restarted**
		- **Note: Once started, take a nap while compiling shaders**
1. Plugins
	- In Windows Exlorer, add a "Plugins" folder in your project folder (same level as the `*.uproject` file)
	- Required built-in plugins
		- Hololens (already installed if using template)
			- UE5: plugin not found. Believe to be already included
		- Microsoft Windows Mixed Reality (already installed if using template)
	- Optional built-in plugins
		- Datasmith Capabilities (already installed if using template)
			- Datasmith CAD Importer
			- Datasmith Content
			- Datasmith glTF Importer
			- Datasmith Importer
	- Third Party Plugins
		- Microsoft UXTools
			- url = https://github.com/microsoft/MixedReality-UXTools-Unreal
			- branch = public/0.12.x-UE4.27
			- Download the zip folder and extract to the "Plugins" folder
			- Rename to UXTools
		
## Trouble Shooting:
- UATHelper: Packaging (HoloLens): ERROR: Visual Studio 2019 ARM64 must be installed in order to build this target. See above for visual studio packages needed to be installed