#!/bin/bash

# Created by Hannes G.
# aka. Pitscher
# https://github.com/pitscher

### Insert your values here

# The URL of your container registry
REGISTRY_URL=""
# The path of your project where the Dockerfile is located
WEBAPP_PATH=""
# The name you want to give the Docker image you build and push
WEBAPP_IMAGE_NAME=""
API_PATH=""
API_IMAGE_NAME=""

##############################################################
##         FROZEN ZONE - DONT CHANGE THE CODE BELOW         ##
##############################################################

###############
## Functions ##
###############

function fnc_DockerWebapp () {
    clear
    # Display sticky header
    echo "D o c k e r - A u t o m a t e"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo "Your selection: WEBAPP"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    WEBAPP_DOCKERFILE_PATH=${WEBAPP_PATH%/}/Dockerfile
    if [ ! -f "$WEBAPP_DOCKERFILE_PATH" ]; then
        clear
        echo "[ERR]  Not found required Dockerfile"
        echo "There is no Dockerfile at >>> $WEBAPP_PATH <<<"
        echo "Aborting..."
        exit
    else
        echo "[OK]  Found required Dockerfile"
        # Asking the user to enter a tag/version
        echo "Enter a tag (like a version number, e.g. 1.0)"
        read -p "--> " WEBAPP_TAG
        echo "Ok. Set tag/version to >>> $WEBAPP_TAG <<<"
        echo "STEP 1 --> Docker build"
        # Performing Docker commands
        docker build -t $WEBAPP_IMAGE_NAME:$WEBAPP_TAG $WEBAPP_PATH
        echo "STEP 1 --> Done."
        clear
        echo "STEP 2 --> Docker push"
        docker push $WEBAPP_IMAGE_NAME:$WEBAPP_TAG
        echo "STEP 2 --> Done."
        echo "All done. Ending the script..."
        clear
        echo "Bye."
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerApi () {
    clear
    # Display sticky header
    echo "D o c k e r - A u t o m a t e"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo "Your selection: API"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    API_DOCKERFILE_PATH=${API_PATH%/}/Dockerfile
    if [ ! -f "$API_DOCKERFILE_PATH" ]; then
        clear
        echo "[ERR]  Not found required Dockerfile"
        echo "There is no Dockerfile at >>> $API_PATH <<<"
        echo "Aborting..."
        exit
    else
        echo "[OK]  Found required Dockerfile"
        # Asking the user to enter a tag/version
        echo "Enter a tag (like a version number, e.g. 1.0)"
        read -p "--> " API_TAG
        echo "Ok. Set tag/version to >>> $API_TAG <<<"
        echo "STEP 1 --> Docker build"
        # Performing Docker commands
        docker build -t $API_IMAGE_NAME:$API_TAG $API_PATH
        echo "STEP 1 --> Done."
        clear
        echo "STEP 2 --> Docker push"
        docker push $API_IMAGE_NAME:$API_TAG
        echo "STEP 2 --> Done."
        echo "All done. Ending the script..."
        clear
        echo "Bye."
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerWebappApi () {
    clear
    # Display sticky header
    echo "D o c k e r - A u t o m a t e"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo "Your selection: WEBAPP + API"
    # Check if we can perform docker build (Dockerfile is required)
    # The "%/" removes a tailing "/" if the user would provide one 
    WEBAPP_DOCKERFILE_PATH=${WEBAPP_PATH%/}/Dockerfile
    API_DOCKERFILE_PATH=${API_PATH%/}/Dockerfile
    if [ ! -f "$WEBAPP_DOCKERFILE_PATH" ] && [ ! -f "$API_DOCKERFILE_PATH" ]; then
        clear
        echo "[ERR]  Not found required Dockerfiles"
        echo "There is no Dockerfile at >>> $WEBAPP_PATH <<< or >>> $API_PATH <<<"
        echo "Aborting..."
        exit
    else
        echo "[OK]  Found required Dockerfiles"
        # Asking the user to enter a tag/version of WEBAPP
        echo "For WEBAPP enter a tag (like a version number, e.g. 1.0)"
        read -p "--> " WEBAPP_TAG
        echo "Ok. Set tag/version of WEBAPP to >>> $WEBAPP_TAG <<<"
        # Asking the user to enter a tag/version of API
        echo "For API enter a tag (like a version number, e.g. 1.0)"
        read -p "--> " API_TAG
        echo "Ok. Set tag/version of API to >>> $API_TAG <<<"
        # Performing Docker commands
        echo "STEP 1 --> Docker build"
        docker build -t $WEBAPP_IMAGE_NAME:$WEBAPP_TAG $WEBAPP_PATH
        clear
        docker build -t $API_IMAGE_NAME:$API_TAG $API_PATH
        echo "STEP 1 --> Done."
        clear
        echo "STEP 2 --> Docker push"
        docker push $WEBAPP_IMAGE_NAME:$WEBAPP_TAG
        clear
        docker push $API_IMAGE_NAME:$API_TAG
        echo "STEP 2 --> Done."
        echo "All done. Ending the script..."
        clear
        echo "Bye."
        sleep 1
        clear
        exit
    fi
}

function fnc_DockerClean () {
    clear
    # Display sticky header
    echo "D o c k e r - A u t o m a t e"
    echo "- - - - - - - - - - - - - - - - -"
    echo ""
    echo "Your selection: Delete unused Docker images"
    echo "docker images prune -a"
    clear
    exit
}

clear
# Display sticky header
echo "D o c k e r - A u t o m a t e"
echo "- - - - - - - - - - - - - - - - -"
echo ""
echo "Checking requirements..."
echo ""

############################
## Checking prerequisites ##
############################

# Check if computer is online
if ping -c 1 8.8.8.8 > /dev/null; then
    echo "[OK]   Computer is online"
else
    echo "[ERR]  Computer is offline"
    echo "Aborting..."
    exit
fi

# Check if docker is installed
if [ -x "$(command -v docker)" ]; then
    echo "[OK]   Docker is installed"
else
    echo "[ERR]  Docker not installed"
    echo "You can install Docker easily via:\nsudo apt-get install docker-ce or\nsudo yum install docker-ce or\nsudo dnf install docker-ce"
    echo "Consult your favourite search engine for further help"
    echo "Aborting..."
    exit
fi

# Check if user set a registry url
if [ ! -z "$REGISTRY_URL" ]; then
    echo "[OK]   Registry url is set"
else
    echo "[ERR]  Registry url not set (See code of this script)"
    echo "For REGISTRY_URL set the url of your Docker registry\n--> without protocol (http:// or https://)\n--> without any further path\n\nWorking example: registry.gitlab.com\n\nIf you use DockerHub please use index.docker.io\n\n"
    echo "Aborting..."
    exit
fi

# Check if user already logged in the configured registry
if ! grep -q "$REGISTRY_URL" ~/.docker/config.json
then
    echo "[WARN] Registry: Login required"
    echo "You can login to you registry easily via:\ndocker login $REGISTRY_URL"
    echo "Aborting..."
else
    echo "[OK]   Registry: Already logged in"
fi

# Check if user set a WEBAPP_PATH
if [ ! -z "$WEBAPP_PATH" ]; then
    echo "[OK]   WEBAPP_PATH is set"
else
    echo "[ERR]  WEBAPP_PATH not set (See code of this script)"
    echo "For WEBAPP_PATH set the path of your project where the Dockerfile is located."
    echo "Aborting..."
    exit
fi

# Check if user set a WEBAPP_IMAGE_NAME
if [ ! -z "$WEBAPP_IMAGE_NAME" ]; then
    echo "[OK]   WEBAPP_IMAGE_NAME is set"
else
    echo "[ERR]  WEBAPP_IMAGE_NAME not set (See code of this script)"
    echo "For WEBAPP_IMAGE_NAME set the name of the Docker image you want to build/push."
    echo "Aborting..."
    exit
fi

# Check if user set an API_PATH
if [ ! -z "$API_PATH" ]; then
    echo "[OK]   API_PATH is set"
else
    echo "[ERR]  API_PATH not set (See code of this script)"
    echo "For API_PATH set the path of your project where the Dockerfile is located."
    echo "Aborting..."
    exit
fi

# Check if user set an API_IMAGE_NAME
if [ ! -z "$API_IMAGE_NAME" ]; then
    echo "[OK]   API_IMAGE_NAME is set"
else
    echo "[ERR]  API_IMAGE_NAME not set (See code of this script)"
    echo "For API_IMAGE_NAME set the name of the Docker image you want to build/push."
    echo "Aborting..."
    exit
fi

sleep 1
clear

echo "D o c k e r - A u t o m a t e"
echo "- - - - - - - - - - - - - - - - -"
echo ""

##########################
## Ask user what to do ###
##########################

echo "Please select what you want to build & push (insert number only)."
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
		echo "[ERR]  Unsupported selection (Insert numbers only!)"
        echo "1) WEBAPP\n2) API\n3) WEBAPP + API\n4) Cancel"
	fi
done
exit