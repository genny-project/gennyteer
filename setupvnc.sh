#!/bin/bash

if [ -z "$1" ]
  then
    echo "vncpassword needs to be sypplied ... e.g. ./setup.sh password1"
  else 
vncpassword=$1

#With thanks to nateware/gist:3915757
#Warning: macos 10.14 and later only allows control if Screen Sharing is enabled through System Preferences.

#Set up privileges
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -configure -allowAccessFor -allUsers -privs -all

# Step 2: Allow VNC clients
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -configure -clientopts -setvnclegacy -vnclegacy yes

# Step 3: Set VNC password (change it at the end of the line (i.e. don't use supersecret))
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -configure -clientopts -setvncpw -vncpw $vncpassword 

# Step 4: Restart service
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -restart -agent -console

# Step 5: If no ARD services have been activated on the machine before, it is also necessary to run the following command
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate


#disable local screen sharing service
#sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.screensharing.plist
fi
