#!/bin/sh

function failed {
    echo "$(tput setaf 1)$@$(tput sgr0)"
    echo -e "\nFailed to install. Please visit https://github.com/shikhir-arora/basicverify/issues.\n"
    exit 1
}

echo ""
echo "Basic Verify Bot Installer - Starting.."

if hash git 1>/dev/null 2>&1
then
    echo ""
    echo "Git is installed on this system."
else
    echo ""    
    echo "Git is not installed on this system. Please install Git."
    exit 1
fi

if hash node 1>/dev/null 2>&1
then
    echo ""
    echo "Node.js is installed on this system."
else
    echo ""    
    echo "Node.js is not installed on this system. Please install Node v10 or above."
    exit 1
fi

# Make temporary directory to ensure fresh install. The package will be downloaded and the node_modules will be installed in a temporary directory
# After installing the modules, basicverify (which includes the node_modules) will be moved out of the temporary folder and that temporary folder will be deleted

directory=$(pwd)
tempinstalldir=basicverifytmp

rm -r "$tempinstalldir" 1>/dev/null 2>&1
mkdir "$tempinstalldir"
cd "$tempinstalldir"

echo ""
echo "Downloading, please wait.."
git clone --recursive --depth 1 https://github.com/shikhir-arora/basicverify.git || failed "Cannot install. Ensure you have permissions!"
echo ""
echo "BasicVerify downloaded!"

echo ""
echo "Downloading bot dependencies with pnpm."
cd $directory/$tempinstalldir/basicverify || failed "Could not enter the basicverify folder - please check permissions!"
curl -L https://unpkg.com/@pnpm/self-installer | node
pnpm install 

cd "$directory"
mv "$tempinstalldir"/basicverify basicverify
rm -r "$tempinstalldir"

echo ""
echo "Installation Complete. Please edit config.json with your variables!"
exit 0
