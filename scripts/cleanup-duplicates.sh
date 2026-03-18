#!/bin/bash

# Remove duplicate page directories that conflict with /(website) routes
rm -rf /vercel/share/v0-project/app/about
rm -rf /vercel/share/v0-project/app/booking
rm -rf /vercel/share/v0-project/app/contact
rm -rf /vercel/share/v0-project/app/fleet
rm -rf /vercel/share/v0-project/app/services
rm -rf /vercel/share/v0-project/app/terms

echo "Removed duplicate page directories"
