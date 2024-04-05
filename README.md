# WhoShouldWeYellAt

[!["I have an idea for a website
Tell me what you think
WhoShouldIYellAt.com
Put in your zip code and issue you're mad about - taxes, abortion, zoning reform
You get back - a list of elected officials with that issue under their purview in some way
"](https://pbs.twimg.com/media/GKVh3bsWoAATqWz?format=jpg&name=medium)](https://twitter.com/emiliepfrank/status/1775933238592319953)

## Contributing
The website frontend is written in TypeScript and deployed with Next.js/Vercel. 

Right now there is one main page showing dummy records from the Supabase Postgres database. This page is located at `app/page.tsx`.

PRs are welcome for components and layouts such as listed below:

### Components we need

1. ZIP Code Text Entry
2. Policy Gripe Text Entry (or dropdown?)


## Database Schema

### Tables
Public schema
1. Officials
2. Issues
3. Precincts
4. Notes

## Where do we get the data?
1. Elected officials
	1. precinct
	2. zip code
	3. office responsibilities
	4. campaign messaging
2. Issues
	1. taxes, abortion, zoning reform, etc.
	2. wording heterogeneity
		1. text corpus of similar references to common issues
		2. aliases for each

## Reference links / utils
1. https://github.com/unitedstates
2. https://github.com/unitedstates/congress-legislators
3. https://github.com/unitedstates/python-us
4. https://github.com/unitedstates/districts
5. https://hub.arcgis.com/datasets/d6f7ee6129e241cc9b6f75978e47128b/explore?location=32.505716%2C-96.100453%2C4.37

## Concern points
1. How do you do this frontend? This repo is NextJS on Vercel.
