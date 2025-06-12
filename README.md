# AVAYL Page Break

These are some notes about the AVAYL coding challenge. Start by checking out the [HTML here](https://app.avayl.tech/coding_task.html).

## Description

Without using a library (and just a regular Typescript/Vue project), implement a **page-break algorithm**. This means: shift the content of a document to the “next page” based off an inputted page height (in pixels).

## Considerations

- The cut-off point could be on any element, but the more complex ones are:
  - Within an **image**
  - Within a **table**
  - Within a **list**
- Check each cut-off point to see if subsequent pages get created (so after a 1000px break into a 2nd page, it would also check the element at 2000px to see if that needs to be broken into a 3rd page).

## Observations

I went on Google Docs and played around with moving certain things over to the next page...

- List items _cut_ to the next page.
- Table cells _cut_ to the next page.
- Images _don’t cut_ to the next page (they need to fit entirely within the page it’s on).

## Ideas

This reminds me of a game design problem involving [hitboxes](https://en.wikipedia.org/wiki/Collision_detection#Hitbox). If, for example, you’re checking if a character gets hit by a fireball, they have a box drawn around them to denote what’s “hittable” on their body. If the fireball’s hitbox intersects with the character’s hitbox, it’s a hit. Otherwise, it’s a miss.

This page-break algorithm is essentially checking the same thing: does the **page-break pixel height** (the fireball) hit the **text’s position** (the character)? If yes, check what got hit, and appropriately split the content onto a newly-created page. The "hit" is an imaginary horizontal line that runs across the page at a certain pixel height.

- Something like a `<p>` tag would just need to be split onto the next line.
- A `<ul>` tag would need to be split at the next `<li>` tag.
- A `<table>` tag would need to be split at the next `<tr>` tag.
- An `<img>` tag would need to be moved entirely onto the next page.
- A `<div>` or `<span>` tag would need to be split at the next child element.
- A `<br>` tag would need to be split at the next line break.
