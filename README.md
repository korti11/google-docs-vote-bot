# Google Forms Vote Bot
## Description
This bot is used to automate voting on google forms.

## Usage
```bash
docker run -d --name=google-forms-vote-bot -e FORM_URL="https://docs.google.com/forms/..." -e ENTRY="Test" --init --cap_add=SYS_ADMIN docker.pkg.github.com/korti11/google-docs-vote-bot/google-forms-vote-bot:latest
```
The parameter --init and --cap_add=SYS_ADMIN are needed for Puppeteer to work within the docker container.

### Environment variables
#### FORM_URL
`required: true`

This option holds the URL of the google form where to connect to.

#### ENTRY_MODE
`required: true`

`default: single`

This option tells the bot if how to select the vote options.

**Modes**
- single
    - Only select one specific entry given by ENTRY.
- multiple
    - Select all specific entries given by ENTRIES.
- random
    - Select one random entry of the specific entries given by ENTRIES.

#### ENTRY
`required: if ENTRY_MODE is single`

This option tells which entry of the vote should be selected.

#### ENTRIES
`required: if ENTRY_MODE is multiple or random`

This option tells which entries of the vote should be selected.

#### MIN_WAIT_TIME
`required: true`

`default: 1`

This option is given in seconds and tell the bot what the min time is to wait between each vote.

#### MAX_WAIT_TIME
`required: true`

`default: 2`

This option is given in seconds and tell the bot what the max time is to wait between each vote.

### Wait time
The wait time is selected randomly between the MIN_WAIT_TIME and the MAX_WAIT_TIME. Per default each vote already has a min runtime of one second.

### Docker Compose
```YAML
version: '3.8'
services:
    google-forms-vote-bot:
        container_name: 'google-forms-vote-bot'
        image: docker.pkg.github.com/korti11/google-docs-vote-bot/google-forms-vote-bot:latest
        init: true
        cap_add:
            - SYS_ADMIN
        environment:
            FORM_URL: "https://docs.google.com/forms/..."
            ENTRY: True
```
