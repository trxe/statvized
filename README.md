# statvized

extremely detailed dataviz from available nhl.com data

## Roadmap

- [ ] shift chart for any game (dropdown)
- [ ] populate shift with plays given any shift
    - [ ] calculate CF/CA/FF/FA/TOI etc per shift
    - [ ] hovering over shift should give shift info in a shift card
- [ ] populate player with all plays
    - [ ] aggregate stats across shift
    - [ ] player card to the side with all aggregated stats
    - [ ] hovering over shift should give shift info
- [ ] rink viz card
    - [ ] plot out (x,y) coords of play
        - [ ] highlight all involved players per play
- [ ] goal viz
    - [ ] animate all players on ice
    - [ ] table for monitoring physical details (velocity/acceleration/position)

## Devlog

### v0.0.0 [current]

- WIP

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
