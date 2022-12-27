<?php
/**
 * Plugin Name: CRUD User
 * Description: Feature includes CRUD user
 * Version: 1.0
 * Author: Ong
 * License: GPL2
 */
if (!defined('ABSPATH')) {
  exit;
}

require_once ABSPATH . 'wp-admin/includes/upgrade.php';

add_action("rest_api_init", function () {
  register_rest_route("wp/v2", "user_list", array(
    'methods' => "GET",
    'callback' => "get_user_list",
    'permission_callback' => '__return_true',
  ));
});

add_action('rest_api_init', function () {
  register_rest_route(
    'wp/v2',
    'user/(?P<id>\d+)',
    array(
      'methods' => 'GET',
      'callback' => 'get_user',
      'permission_callback' => '__return_true',
    )
  );
});

add_action('rest_api_init', function () {
  register_rest_route(
    'wp/v2',
    'create_user',
    array(
      'methods' => 'POST',
      'callback' => 'create_user_alyka',
      'permission_callback' => '__return_true',
    )
  );
});

add_action('rest_api_init', function () {
  register_rest_route(
    'wp/v2',
    'edit_user',
    array(
      'methods' => 'POST',
      'callback' => 'edit_user_alyka',
      'permission_callback' => '__return_true',
    )
  );
});

add_action('rest_api_init', function () {
  register_rest_route(
    'wp/v2',
    'delete_user',
    array(
      'methods' => 'DELETE',
      'callback' => 'delete_user_alyka',
      'permission_callback' => '__return_true',
    )
  );
});

function create_user_table()
{
  global $wpdb;
  $test_users_table = $wpdb->prefix . 'test_users';
  $table = "CREATE TABLE IF NOT EXISTS $test_users_table (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    user_role varchar(255) NOT NULL,
    UNIQUE KEY id (id)
  ) COLLATE 'utf8mb4_unicode_ci';";
  dbDelta($table);
}

create_user_table();
function get_user_list()
{
  try {
    global $wpdb;
    $tableName = $wpdb->prefix . "test_users";
    $query = "SELECT * FROM $tableName";
    $data = $wpdb->get_results($query);
    return $data;
  } catch (Exception $e) {
    echo $e;
  }
}

function get_user(WP_REST_Request $request)
{
  try {
    global $wpdb;
    $user_id = $request['id'];
    $tableName = $wpdb->prefix . "test_users";
    $query = "SELECT * FROM $tableName WHERE `id` = $user_id";
    $data = $wpdb->get_row($query);
    return $data;
  } catch (Exception $e) {
    echo $e;
  }
}
function check_email_used($email)
{
  global $wpdb;
  $tableName = $wpdb->prefix . "test_users";
  $query = $wpdb->prepare("SELECT email FROM $tableName");
  $existing_emails = $wpdb->get_col($query);
  if (in_array($email, $existing_emails)) {
    return new WP_Error('Error', 'This email has been used before', array('status' => 406));
  } else {
    return false;
  }
}

function create_user_alyka(WP_REST_Request $request)
{
  try {
    global $wpdb;
    $tableName = $wpdb->prefix . "test_users";

    $req = json_decode($request->get_body());
    if (!in_array($req->role, array("administrator", "subscriber", "reader"))) {
      return new WP_Error("Role should be either administrator, subscriber or reader");
    }
    $isDuplicated = check_email_used($req->email);
    if ($isDuplicated) {
      return $isDuplicated;
    } else {
      $inserted_data = array(
        'first_name' => $req->first_name,
        'last_name' => $req->last_name,
        'email' => $req->email,
        'user_role' => $req->role,

      );
      $res = $wpdb->insert($tableName, $inserted_data);
      if ($res) {
        return ['message' => "Created Successfully"];
      }
    }
  } catch (Exception $e) {
    throw $e;
  }
}

function edit_user_alyka(WP_REST_Request $request)
{
  try {
    global $wpdb;
    $tableName = $wpdb->prefix . "test_users";
    $req = json_decode($request->get_body());
    $user_id = $req->id;
    $own_email = $wpdb->get_var("SELECT email from $tableName WHERE `id`=$req->id");
    $isDuplicated = $req->email === $own_email ? false : check_email_used($req->email);
    if (!in_array($req->role, array("administrator", "subscriber", "reader"))) {
      return new WP_Error("Role should be either administrator, subscriber or reader");
    }

    if ($isDuplicated) {
      return $isDuplicated;
    } else {
      $update_data = array(
        'first_name' => $req->first_name,
        'last_name' => $req->last_name,
        'email' => $req->email,
        'user_role' => $req->role,
      );

      $cond = array("id" => $user_id);
      $res = $wpdb->update($tableName, $update_data, $cond);
      if (false === $res) {
        return new WP_Error("Update fail", "Update fail");
      } else {
        return ['message' => "Update Successfully"];
      }
    }

    // else
  } catch (Exception $e) {
    throw $e;
  }
}

function delete_user_alyka(WP_REST_Request $request)
{
  try {
    global $wpdb;
    $tableName = $wpdb->prefix . "test_users";
    $req = json_decode($request->get_body());
    $cond = array("id" => $req->id);

    $res = $wpdb->delete($tableName, $cond);
    // return $res;
    if ($res === 0) {
      return new WP_Error("Delete fail", "Delete fail");
    } else {
      return ['message' => "Deleted Successfully"];
    }

    // else
  } catch (Exception $e) {
    throw $e;
  }
}