<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

// API Endpoints for SIMPRO
$routes->group('api', ['namespace' => 'App\Controllers'], static function ($routes) {
    // Auth Endpoints
    $routes->post('login', 'Api::login');
    $routes->post('logout', 'Api::logout');
    $routes->get('auth-status', 'Api::authStatus');

    $routes->get('projectors', 'Api::getProjectors');
    $routes->post('projectors', 'Api::saveProjector');
    $routes->delete('projectors/(:segment)', 'Api::deleteProjector/$1');

    $routes->get('teachers', 'Api::getTeachers');
    $routes->post('teachers', 'Api::saveTeacher');
    $routes->delete('teachers/(:segment)', 'Api::deleteTeacher/$1');

    $routes->get('classes', 'Api::getClasses');
    $routes->post('classes', 'Api::saveClass');
    $routes->delete('classes/(:segment)', 'Api::deleteClass/$1');

    $routes->get('logs', 'Api::getLogs');
    $routes->post('borrow', 'Api::borrow');
    $routes->post('return', 'Api::returnProjector');
    $routes->post('resolve-complaint', 'Api::resolveComplaint');
});
