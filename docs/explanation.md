## Description

Without using a library (and just a vanilla Typescript/Vue project), implement a page-break algorithm. This means: shift the content of a document to the “next page” based off an inputted height (in pixels).

## Considerations

- The cut-off point could just be on a line (easier to deal with) but could also be:
  - Within an image
  - Within a table
  - Within a list
- If multiple pages get created, check each cut-off point to see if subsequent pages get created.

## Observations

I went on Google Docs and played around with moving certain things over to the next page…

- List items cut to the next page.
- Table cells cut to the next page.
- Images don’t cut to the next page (they need to fit entirely within the page it’s on).

## Ideas

This reminds me of a game design problem involving hitboxes. If, for example, you’re checking if a character gets hit by a fireball, they have a box drawn around them to denote what’s “hittable” on their body. If the fireball’s hitbox intersects with the character’s hitbox, it’s a hit. Otherwise, it’s a miss.

This page-break algorithm is essentially checking the same thing: does the page-break pixel height (the fireball) hit the text’s position (the character)? If yes, check what got hit, and appropriately split the content onto a newly-created page.
