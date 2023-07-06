# /bin/sh

if [[ $(uname) != 'Darwin' ]]; then
    printf "\e[1;31mThis is for MacOS only!\e[0m\n"
    exit 1
fi

if [[ $(uname -m) != 'arm64' ]]; then
  printf "\e[1;31mThis script is for AppleSilicon chips only!\e[0m\n"
  exit 1
fi

printf "\e[1;35m*** Installing binaries for Mac ***\e[0m\n\n"

download_url="https://uc5fb6e8d41dd5308924ef3cf1d7.dl.dropboxusercontent.com/zip_download_get/BisNVMqxyK3Zu8VjKv7XahB3NhUTxJCsJMNlHjUBPyZgqf98PRFU7HeQaBOPFp578LopcK6HM1ttIRd4b0PIU47V4WauWfNQUxRU7c4EW1pIwg?dl=1"

checksum="4cdf99c16fffcb06b864947717ef7249de0507b59a956a6c25d4c61fb8027c7d"

zip_file="bin.zip"
curl $download_url -o $zip_file

echo "verifying checksum..."
hash=($(sha256sum $zip_file))

if [[ $hash != $checksum ]]; then
    echo "The downloaded files have changed, please verify if download link is still updated."
    rm $zip_file
    exit 1
fi

unzip $zip_file -x / -d bin
if [ $? -eq 0 ]; then
    rm $zip_file
    printf "\e[1;32mSuccessfully installed binaries!\e[0m\n"
fi
