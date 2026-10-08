<?php

namespace App\Models;

use CodeIgniter\Model;

class ProyektorModel extends Model
{
    protected $table            = 'proyektor';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'code',
        'name',
        'model',
        'bag_color',
        'bag_color_hex',
        'location',
        'status',
        'lamp_hours',
        'last_maintenance',
        'specs',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
