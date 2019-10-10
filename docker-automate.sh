REGISTRY_URL="registry.gitlab.com"

#clear
#while true; do
#    read -p 'Ja oder nein?\' yn
#    case $yn in
#        [Yy]* ) echo -n "Ja gewählt!"; break;;
#        [Nn]* ) exit;;
#        * ) echo "Bitte ja oder nein wählen.";;
#    esac
#done
clear
echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
echo -e "\e[2mhttps://github.com/pitscher\e[0m"
echo "- - - - - - - - - - - - - - - - -"
echo ""
echo -e "\e[1mChecking requirements...\e[0m"
echo ""

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

# Check if user provided a registry url
if [ ! -z "$REGISTRY_URL" ]; then
    echo -e "\e[2m[\e[0m\e[1m\e[92mOK\e[0m\e[1m\e[2m]\e[0m \e[1m  Registry url is available\e[0m"
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

sleep 1
#clear

echo -e "\e[1mD o c k e r - A u t o m a t e\e[0m"
echo -e "\e[2mhttps://github.com/pitscher\e[0m"
echo "- - - - - - - - - - - - - - - - -"
echo ""


exit