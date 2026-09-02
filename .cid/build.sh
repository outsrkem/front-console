#!/bin/bash
workspace=$(cd `dirname $0`/..; pwd)
cd $workspace

SRC_DIR=${workspace}
version="b0.0.0"
release="b1"
app=console
NODE_IMG=node:22-alpine
RPMBUILD_IMG=outsrkem/rpmbuild:4.14.3-rocky8

# Parse input arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--version)
      if [[ -z "$2" ]] || [[ "$2" == -* ]]; then
        echo "Error: -v/--version must be followed by a version number"
        exit 1
      fi
      version="$2"
      shift 2
      ;;
    -r|--release)
      if [[ -z "$2" ]] || [[ "$2" == -* ]]; then
        echo "Error: -r/--release must be followed by a release value"
        exit 1
      fi
      release="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 [-v|--version VERSION] [-r|--release RELEASE]"
      exit 1
      ;;
  esac
done

# Print info
echo "Workspace: $workspace"
echo "App name: $app"
echo "Version: $version"
echo "Release: $release"
echo "Node image: $NODE_IMG"

docker run --rm --net=host \
  -v "${SRC_DIR}:/app" \
  -v "${SRC_DIR}/node_modules:/app/node_modules" \
  -v /tmp/npm_cache:/root/.npm \
  -w /app \
  ${NODE_IMG} \
  sh -c "npm config set registry https://mirrors.huaweicloud.com/repository/npm/ &&\
  npm install --verbose --progress --no-audit --no-fund &&\
  npm run build"

if [ ! -d "${SRC_DIR}/dist" ]; then
  echo "ERROR: npm run build failed, dist directory not found!"
  exit 1
fi

product=${app}-${version}
tar zcvf "${product}.tar.gz" --transform "s/^dist/${product}/" dist

docker run -i --rm \
  -v "$(pwd)/.cid/console.spec:/root/rpmbuild/SPECS/console.spec" \
  -v "$(pwd)/${product}.tar.gz:/root/rpmbuild/SOURCES/${product}.tar.gz" \
  -v "$(pwd)/rpms:/root/rpmbuild/RPMS" \
  -w /root/rpmbuild \
  $RPMBUILD_IMG \
  bash -c "rpmbuild -bb \
  --define \"_version ${version}\" \
  --define \"_release ${release}\" \
  --define \"dist .el6\" \
  --define \"_packager LiHua\" \
  --define \"_email lark@email.com\" SPECS/console.spec"

find . -name "${product}*.gz" -o -name "${product}*.rpm"
