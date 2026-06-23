%{!?_version:  %define _version 0.0.1}
%{!?_release:  %define _release 1}

Name:           console
Version:        %{_version}
Release:        %{_release}%{?dist}
Summary:        console Web Application

License:        MIT
URL:            https://github.com/outsrkem/front-console
Source0:        %{name}-%{version}.tar.gz

%global _enable_debug_packages 0
%global debug_package %{nil}

BuildArch:      x86_64
Requires:       bash >= 4.0
Requires(post): /bin/sh
Requires(postun): /bin/sh

%description
console is a web application that provides web UI services.

%prep
%setup -q

%build
:

%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/opt/www/console
cp -a ./* %{buildroot}/opt/www/console/

%files
/opt/www/console

%post
if id nginx >/dev/null 2>&1 && getent group nginx >/dev/null 2>&1; then
    chown -R nginx:nginx /opt/www/console
else
    cat << EOF
=====================================================================
WARNING: nginx user/group does not exist on this system.

Please create the nginx user and group using:
  # useradd -r -s /sbin/nologin nginx

Then set proper ownership:
  # chown -R nginx:nginx /opt/www/console

Failure to set ownership may cause web service permission issues.
=====================================================================
EOF
fi

%clean
rm -rf %{buildroot}

%postun
if [ $1 -eq 0 ]; then
    rm -rf /opt/www/console
    rmdir /opt/www >/dev/null 2>&1 || :
fi

%changelog
* %(date +"%a %b %d %Y") %{version}-%{release}
- Initial build of console web application
