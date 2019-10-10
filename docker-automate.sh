#!/bin/bash

### Insert your values here

# The URL of your container registry
REGISTRY_URL="registry.gitlab.com"
# The path of your project where the Dockerfile is located
WEBAPP_PATH="/home/hannes/colloquium-selector-robot/webapp"
# The name you want to give the Docker image you build and push
WEBAPP_IMAGE_NAME="registry.gitlab.com/derpitscher/csr/webapp"
API_PATH="/home/hannes/colloquium-selector-robot/api"
API_IMAGE_NAME="registry.gitlab.com/derpitscher/csr/api"

##############################################################
##         FROZEN ZONE - DONT CHANGE THE CODE BELOW         ##
##############################################################

###############
## Functions ##
###############

function fnc_DockerWebapp () {
    clear
    # Display sticky header
    echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
    echo -e "\e[2mhttps://github.com/pitscher\e[0m"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo -e "\e[1mYour selection: WEBAPP\e[0m"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    WEBAPP_DOCKERFILE_PATH=${WEBAPP_PATH%/}/Dockerfile
    if [ ! -f "$WEBAPP_DOCKERFILE_PATH" ]; then
        clear
        echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Not found required Dockerfile\e[0m"
        echo -e "\e[2mThere is no Dockerfile at >>> $WEBAPP_PATH <<<\e[0m"
        echo -e "\e[2mAborting...\e[0m"
        exit
    else
        echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m Found required Dockerfile\e[0m"
        # Asking the user to enter a tag/version
        echo -e "\e[1mEnter a tag (like a version number, e.g. 1.0)\e[0m"
        read -p "--> " WEBAPP_TAG
        echo -e "\e[2mOk. Set tag/version to >>>\e[0m $WEBAPP_TAG \e[2m<<<\e[0m"
        echo -e "\e[1mSTEP 1 --> Docker build\e[0m"
        # Performing Docker commands
        echo -e "docker build -t $WEBAPP_IMAGE_NAME:$WEBAPP_TAG $WEBAPP_PATH"
        echo -e "\e[1mSTEP 1 --> Done.\e[0m"
        #clear
        echo -e "\e[1mSTEP 2 --> Docker push\e[0m"
        echo "docker push $WEBAPP_IMAGE_NAME:$WEBAPP_TAG"
        echo -e "\e[1mSTEP 2 --> Done.\e[0m"
        echo -e "\e[1mAll done. Ending the script...\e[0m"
        #clear
        echo -e "\e[1mBye.\e[0m"
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerApi () {
    clear
    # Display sticky header
    echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
    echo -e "\e[2mhttps://github.com/pitscher\e[0m"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo -e "\e[1mYour selection: API\e[0m"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    API_DOCKERFILE_PATH=${API_PATH%/}/Dockerfile
    if [ ! -f "$API_DOCKERFILE_PATH" ]; then
        clear
        echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Not found required Dockerfile\e[0m"
        echo -e "\e[2mThere is no Dockerfile at >>> $API_PATH <<<\e[0m"
        echo -e "\e[2mAborting...\e[0m"
        exit
    else
        echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m Found required Dockerfile\e[0m"
        # Asking the user to enter a tag/version
        echo -e "\e[1mEnter a tag (like a version number, e.g. 1.0)\e[0m"
        read -p "--> " API_TAG
        echo -e "\e[2mOk. Set tag/version to >>>\e[0m $API_TAG \e[2m<<<\e[0m"
        echo -e "\e[1mSTEP 1 --> Docker build\e[0m"
        # Performing Docker commands
        echo -e "docker build -t $API_IMAGE_NAME:$API_TAG $API_PATH"
        echo -e "\e[1mSTEP 1 --> Done.\e[0m"
        #clear
        echo -e "\e[1mSTEP 2 --> Docker push\e[0m"
        echo "docker push $API_IMAGE_NAME:$API_TAG"
        echo -e "\e[1mSTEP 2 --> Done.\e[0m"
        echo -e "\e[1mAll done. Ending the script...\e[0m"
        #clear
        echo -e "\e[1mBye.\e[0m"
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerWebappApi () {
    clear
    # Display sticky header
    echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
    echo -e "\e[2mhttps://github.com/pitscher\e[0m"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo -e "\e[1mYour selection: WEBAPP + API\e[0m"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    WEBAPP_DOCKERFILE_PATH=${WEBAPP_PATH%/}/Dockerfile
    API_DOCKERFILE_PATH=${API_PATH%/}/Dockerfile
    if [ ! -f "$WEBAPP_DOCKERFILE_PATH" ] && [ ! -f "$API_DOCKERFILE_PATH" ]; then
        clear
        echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Not found required Dockerfiles\e[0m"
        echo -e "\e[2mThere is no Dockerfile at >>> $WEBAPP_PATH <<< or >>> $API_PATH <<<\e[0m"
        echo -e "\e[2mAborting...\e[0m"
        exit
    else
        echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m Found required Dockerfiles\e[0m"
        # Asking the user to enter a tag/version of WEBAPP
        echo -e "\e[1mFor WEBAPP enter a tag (like a version number, e.g. 1.0)\e[0m"
        read -p "--> " WEBAPP_TAG
        echo -e "\e[2mOk. Set tag/version of WEBAPP to >>>\e[0m $WEBAPP_TAG \e[2m<<<\e[0m"
        # Asking the user to enter a tag/version of API
        echo -e "\e[1mFor API enter a tag (like a version number, e.g. 1.0)\e[0m"
        read -p "--> " API_TAG
        echo -e "\e[2mOk. Set tag/version of API to >>>\e[0m $API_TAG \e[2m<<<\e[0m"
        # Performing Docker commands
        echo -e "\e[1mSTEP 1 --> Docker build\e[0m"
        echo -e "docker build -t $WEBAPP_IMAGE_NAME:$WEBAPP_TAG $WEBAPP_PATH"
        clear
        echo -e "docker build -t $API_IMAGE_NAME:$API_TAG $API_PATH"
        echo -e "\e[1mSTEP 1 --> Done.\e[0m"
        clear
        echo -e "\e[1mSTEP 2 --> Docker push\e[0m"
        echo "docker push $WEBAPP_IMAGE_NAME:$WEBAPP_TAG"
        clear
        echo "docker push $API_IMAGE_NAME:$API_TAG"
        echo -e "\e[1mSTEP 2 --> Done.\e[0m"
        echo -e "\e[1mAll done. Ending the script...\e[0m"
        clear
        echo -e "\e[1mBye.\e[0m"
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerClean () {
    clear
    # Display sticky header
    echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
    echo -e "\e[2mhttps://github.com/pitscher\e[0m"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo -e "\e[1mYour selection: Delete unused Docker images\e[0m"
    echo "docker images prune -a"
    clear
    exit
}

clear
# Display sticky header
echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
echo -e "\e[2mhttps://github.com/pitscher\e[0m"
echo "- - - - - - - - - - - - - - - - -"
echo ""
echo -e "\e[1mChecking requirements...\e[0m"
echo ""

############################
## Checking prerequisites ##
############################

# Check if computer is online
if ping -c 1 8.8.8.8 > /dev/null; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  Computer is online\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Computer is offline\e[0m"
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if docker is installed
if [ -x "$(command -v docker)" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  Docker is installed\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Docker not installed\e[0m"
    echo -e "You can install Docker easily via:\n\e[7msudo apt-get install docker-ce\e[0m or\n\e[7msudo yum install docker-ce\e[0m or\n\e[7msudo dnf install docker-ce\e[0m"
    echo "Consult your favourite search engine for further help"
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if user set a registry url
if [ ! -z "$REGISTRY_URL" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  Registry url is set\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Registry url not set \e[2m(See code of this script)\e[0m"
    echo -e "For REGISTRY_URL set the url of your Docker registry\n--> without protocol (http:// or https://)\n--> without any further path\n\nWorking example: registry.gitlab.com\n\nIf you use DockerHub please use index.docker.io\n\n"
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if user already logged in the configured registry
if ! grep -q "$REGISTRY_URL" ~/.docker/config.json
then
    echo -e "\e[2m[\e[0m\e[1m\e[93mWARN\e[0m\e[1m\e[2m]\e[0m \e[1mRegistry: Login required\e[0m"
    echo -e "You can login to you registry easily via:\n\e[7mdocker login $REGISTRY_URL\e[0m"
    echo -e "\e[2mAborting...\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  Registry: Already logged in\e[0m"
fi

# Check if user set a WEBAPP_PATH
if [ ! -z "$WEBAPP_PATH" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  WEBAPP_PATH is set\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m WEBAPP_PATH not set \e[2m(See code of this script)\e[0m"
    echo -e "For WEBAPP_PATH set the path of your project where the Dockerfile is located."
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if user set a WEBAPP_IMAGE_NAME
if [ ! -z "$WEBAPP_IMAGE_NAME" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  WEBAPP_IMAGE_NAME is set\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m WEBAPP_IMAGE_NAME not set \e[2m(See code of this script)\e[0m"
    echo -e "For WEBAPP_IMAGE_NAME set the name of the Docker image you want to build/push."
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if user set an API_PATH
if [ ! -z "$API_PATH" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  API_PATH is set\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m API_PATH not set \e[2m(See code of this script)\e[0m"
    echo -e "For API_PATH set the path of your project where the Dockerfile is located."
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

# Check if user set an API_IMAGE_NAME
if [ ! -z "$API_IMAGE_NAME" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  API_IMAGE_NAME is set\e[0m"
else
    echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m API_IMAGE_NAME not set \e[2m(See code of this script)\e[0m"
    echo -e "For API_IMAGE_NAME set the name of the Docker image you want to build/push."
    echo -e "\e[2mAborting...\e[0m"
    exit
fi

sleep 1
clear

echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
echo -e "\e[2mhttps://github.com/pitscher\e[0m"
echo "- - - - - - - - - - - - - - - - -"
echo ""

##########################
## Ask user what to do ###
##########################

echo -e "\e[1mPlease select what you want to build & push (insert number only).\e[0m"
options="WEBAPP API WEBAPP+API Cleaning Cancel"
select option in $options; do
	if [ "WEBAPP" = $option ]; then
		fnc_DockerWebapp
	elif [ $option = "API" ]; then
		fnc_DockerApi
   	elif [ $option = "WEBAPP+API" ]; then
		fnc_DockerWebappApi
    elif [ $option = "Cleaning" ]; then
		fnc_DockerClean
    elif [ $option = "Cancel" ]; then
    	echo "Aborting..."
	    exit
	else
        clear
		echo -e "\e[2m[\e[0m\e[1m\e[91mERR\e[0m\e[1m\e[2m]\e[0m \e[1m Unsupported selection \e[2m(Insert numbers only!)\e[0m"
        echo -e "\e[2m1) WEBAPP\e[0m\n\e[2m2) API\e[0m\n\e[2m3) WEBAPP + API\e[0m\n\e[2m4) Cancel\e[0m"
	fi
done
exit