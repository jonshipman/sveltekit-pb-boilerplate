#!/bin/bash

# Script only runs on *nix
npx pocketbase-typegen --db ./db/pb_data/data.db --out web/src/lib/pocketbase/index.d.ts
