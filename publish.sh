yarn build
if [ $? -eq 0 ]; then
    pushd build
    npm publish
    popd
fi
