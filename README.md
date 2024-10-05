# Tokyo

AI video call notetaker that integrates with slack.

## Inspiration
We wanted to create a tool that would help people take notes during video calls. Tokyo is mainly inspired by Fathom.ai. However, we wanted to create a tool that goes beyond just notes and facilitate collaboration between team members.
This is where the integration with slack comes in. Tokyo automatically share these notes with the team members on slack. Moreover, it also allows team members to add comments to the notes and ask questions and colaborate on a deeper level.

# Docs
1. [Protecting APIs](https://supertokens.com/docs/thirdpartyemailpassword/nextjs/app-directory/session-verification-middleware)

# Local setup
1. Ask for `.env` file
2. `mkdir stacks && mkdir stacks/dev_db_data`
3. `make start-dev` - this starts necessary containers
4. `pnpm install`
5. `pnpm dbm && pnpm dev`
6. `./scripts/serve_from_local.sh`
7. visit - https://local-dev.shoja.ai
