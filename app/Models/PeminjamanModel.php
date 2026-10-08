<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table            = 'peminjaman';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'unit_id',
        'unit_name',
        'teacher_name',
        'destination_class',
        'subject',
        'duration_period',
        'borrow_time',
        'return_time',
        'status',
        'checklist_borrow',
        'checklist_return',
        'condition_return',
        'complaints',
        'complaint_note',
        'needs_direct_action',
        'notes',
        'hours_used',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
