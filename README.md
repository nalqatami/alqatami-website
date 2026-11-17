# Al-Qatami Family Legacy, running on its own domain

This folder is the whole site. On claude.ai it uses Claude for sign in, requests and uploads. Anywhere else it uses a free Supabase project for the same things, so nothing is lost when it moves.

## What keeps working

1. The tree, profiles, photos, face tags, life story, press, documents, books and the Dewaniya page.
2. Family members signing in with their email (a sign in link is sent to them, no password).
3. Family sending corrections, new relatives and photos, which wait for your approval.
4. Your owner tools: approving or deleting requests, editing captions, adding photos, the tree checkup.

## Setting it up, once

1. Go to supabase.com, make a free account and create a new project. Any name, any region close to Kuwait.
2. In the project, open SQL Editor, paste everything from supabase-setup.sql and press Run. The owner email in the first lines is already set to nooralqatami@gmail.com. Add more owner emails there inside the brackets if you want someone else to approve too.
3. Open Project Settings, then API. Copy the Project URL and the anon public key into config.js.
4. Open Authentication, then URL Configuration. Set Site URL to the address the site will live on, for example https://alqatami.com.
5. Upload the whole folder to the host. Netlify is the easiest: drag the folder onto app.netlify.com/drop, then connect your domain under Domain settings.
6. Open the site, press Family sign in at the bottom, use your email, and click the link in your inbox. You will see your owner tools.

## Privacy and search engines

1. Visitors who are not signed in see living people only as «Living», with no name, photo or facts, and see only the first two pages of each copyrighted book. Signed in family see everything.
2. In Supabase, open Authentication, then Sign In / Providers, and turn off «Allow new users to sign up». Then add each family member under Authentication, Users, Invite user. Only invited family can sign in and see living relatives.
3. The folder «people» holds one simple page for each family member who has passed away, in English and Arabic, so Google can find them by name. Put the real domain in siteUrl in config.js before the last export, and the sitemap for Google is made automatically.

## Good to know

1. Approvals and requests made on the claude.ai version stay there. At the time of export there were none waiting, so nothing needs moving.
2. When you add new photos later, send them as before and the folder can be exported again. Your config.js stays the same.
