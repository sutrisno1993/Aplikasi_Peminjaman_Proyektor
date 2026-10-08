<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        $distHtml = FCPATH . 'index.html';
        if (file_exists($distHtml)) {
            $content = file_get_contents($distHtml);
            return $this->response
                ->setContentType('text/html')
                ->setBody($content);
        }

        return view('welcome_message');
    }
}
