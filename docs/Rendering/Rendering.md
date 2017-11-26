# Rendering

Helix supports multiple render targets through the `renderer` property. You can see an example of three render targets, however you'll see it's pretty easy to create render targets for whatever flavour of view library you like.

Once Helix is mounted in the DOM, it'll take care of re-rendering on state and URL changes using the render function you provide.

It's entirely possible to have more than one Helix app on the page at one time, by passing different `mount` nodes to the renderer for each app.
