Set Up Wordpress (optional if you have staging wordpress playground)
1. cd into server
2. docker-compose up -d
3. open http://localhost:8000 to install Wordpress
4. copy .htaccess file into it to enable API call

WordPress Plugin (Compulsory)
1. copy the plugin files (/server/crud_user) to wp-content/plugins
2. login to the WordPress admin and activate the plugin
3. go to Settings > Permalinks, under Common Settings, check the `Post name` instead of `Plain`

Set Up React
1. `yarn add` in the terminal of this root folder
2. `yarn start` in the terminal
