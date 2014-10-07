<?php

add_action('wp_enqueue_scripts', 'themify_add_scripts');

function themify_add_scripts(){

    wp_enqueue_script( 'MY-JS', get_stylesheet_directory_uri() . '/my-js.js');

}

?>