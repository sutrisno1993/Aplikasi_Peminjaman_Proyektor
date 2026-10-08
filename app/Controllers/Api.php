<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProyektorModel;
use App\Models\GuruModel;
use App\Models\KelasModel;
use App\Models\PeminjamanModel;
use App\Models\KomplainModel;

class Api extends ResourceController
{
    protected $format = 'json';

    // GET /api/projectors
    public function getProjectors()
    {
        $proyektorModel = new ProyektorModel();
        $peminjamanModel = new PeminjamanModel();

        $rawProjectors = $proyektorModel->findAll();
        $projectors = [];

        foreach ($rawProjectors as $p) {
            $activeBorrow = null;
            if ($p['status'] === 'dipinjam') {
                $active = $peminjamanModel
                    ->where('unit_id', $p['id'])
                    ->where('status', 'aktif')
                    ->orderBy('borrow_time', 'DESC')
                    ->first();
                if ($active) {
                    $activeBorrow = [
                        'id'               => $active['id'],
                        'teacherName'      => $active['teacher_name'],
                        'destinationClass' => $active['destination_class'],
                        'durationPeriod'   => $active['duration_period'],
                        'borrowTime'       => $active['borrow_time'],
                        'checklist'        => is_string($active['checklist_borrow']) ? json_decode($active['checklist_borrow'], true) : ($active['checklist_borrow'] ?? []),
                        'notes'            => $active['notes'] ?? '',
                    ];
                }
            }

            $projectors[] = [
                'id'              => $p['id'],
                'code'            => $p['code'] ?? $p['id'],
                'name'            => $p['name'],
                'model'           => $p['model'],
                'bagColor'        => $p['bag_color'] ?? '',
                'bag_color'       => $p['bag_color'] ?? '',
                'bagColorHex'     => $p['bag_color_hex'] ?? '#3b82f6',
                'bag_color_hex'   => $p['bag_color_hex'] ?? '#3b82f6',
                'location'        => $p['location'],
                'status'          => $p['status'],
                'lampHours'       => $p['lamp_hours'] ?? '100 Jam',
                'lamp_hours'      => $p['lamp_hours'] ?? '100 Jam',
                'lastMaintenance' => $p['last_maintenance'],
                'last_maintenance'=> $p['last_maintenance'],
                'specs'           => $p['specs'],
                'activeBorrow'    => $activeBorrow,
            ];
        }

        return $this->respond([
            'status' => 'success',
            'data'   => $projectors,
        ]);
    }

    // POST /api/projectors
    public function saveProjector()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $id = $input['id'] ?? null;
        $proyektorModel = new ProyektorModel();

        $data = [
            'id'              => $id,
            'code'            => $input['code'] ?? $id,
            'name'            => $input['name'],
            'model'           => $input['model'],
            'bag_color'       => $input['bagColor'] ?? ($input['bag_color'] ?? ''),
            'bag_color_hex'   => $input['bagColorHex'] ?? ($input['bag_color_hex'] ?? '#3b82f6'),
            'location'        => $input['location'],
            'status'          => $input['status'] ?? 'tersedia',
            'lamp_hours'      => $input['lampHours'] ?? ($input['lamp_hours'] ?? '100 Jam'),
            'last_maintenance'=> $input['lastMaintenance'] ?? ($input['last_maintenance'] ?? date('Y-m-d')),
            'specs'           => $input['specs'] ?? '',
        ];

        if ($id && $proyektorModel->find($id)) {
            $proyektorModel->update($id, $data);
        } else {
            $newId = $id ?: 'PRJ-' . str_pad($proyektorModel->countAllResults() + 1, 2, '0', STR_PAD_LEFT);
            $data['id'] = $newId;
            $data['code'] = $newId;
            $proyektorModel->insert($data);
        }

        return $this->respond(['status' => 'success', 'message' => 'Data proyektor berhasil disimpan.']);
    }

    // DELETE /api/projectors/(:segment)
    public function deleteProjector($id = null)
    {
        if (!$id) return $this->fail('ID tidak valid.', 400);
        $proyektorModel = new ProyektorModel();
        $proyektorModel->delete($id);
        return $this->respond(['status' => 'success', 'message' => 'Data proyektor berhasil dihapus.']);
    }

    // GET /api/teachers
    public function getTeachers()
    {
        $guruModel = new GuruModel();
        $teachers = $guruModel->orderBy('id', 'ASC')->findAll();
        return $this->respond([
            'status' => 'success',
            'data'   => $teachers,
        ]);
    }

    // POST /api/teachers
    public function saveTeacher()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $id = $input['id'] ?? null;
        $guruModel = new GuruModel();

        if ($id && $guruModel->find($id)) {
            $guruModel->update($id, $input);
        } else {
            $newId = $id ?: 'TCH-' . str_pad($guruModel->countAllResults() + 1, 3, '0', STR_PAD_LEFT);
            $input['id'] = $newId;
            $guruModel->insert($input);
        }

        return $this->respond(['status' => 'success', 'message' => 'Data guru berhasil disimpan.']);
    }

    // DELETE /api/teachers/(:segment)
    public function deleteTeacher($id = null)
    {
        if (!$id) return $this->fail('ID tidak valid.', 400);
        $guruModel = new GuruModel();
        $guruModel->delete($id);
        return $this->respond(['status' => 'success', 'message' => 'Data guru berhasil dihapus.']);
    }

    // GET /api/classes
    public function getClasses()
    {
        $kelasModel = new KelasModel();
        $rawClasses = $kelasModel->orderBy('id', 'ASC')->findAll();
        $classes = [];
        foreach ($rawClasses as $c) {
            $classes[] = [
                'id'              => $c['id'],
                'name'            => $c['name'],
                'grade'           => $c['grade'],
                'major'           => $c['major'],
                'building'        => $c['building'],
                'homeroomTeacher' => $c['homeroom_teacher'] ?? '',
                'homeroom_teacher'=> $c['homeroom_teacher'] ?? '',
            ];
        }
        return $this->respond([
            'status' => 'success',
            'data'   => $classes,
        ]);
    }

    // POST /api/classes
    public function saveClass()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $id = $input['id'] ?? null;
        $kelasModel = new KelasModel();

        $data = [
            'id'               => $id,
            'name'             => $input['name'],
            'grade'            => $input['grade'],
            'major'            => $input['major'],
            'building'         => $input['building'],
            'homeroom_teacher' => $input['homeroomTeacher'] ?? ($input['homeroom_teacher'] ?? ''),
        ];

        if ($id && $kelasModel->find($id)) {
            $kelasModel->update($id, $data);
        } else {
            $newId = $id ?: 'CLS-' . str_pad($kelasModel->countAllResults() + 1, 2, '0', STR_PAD_LEFT);
            $data['id'] = $newId;
            $kelasModel->insert($data);
        }

        return $this->respond(['status' => 'success', 'message' => 'Data kelas berhasil disimpan.']);
    }

    // DELETE /api/classes/(:segment)
    public function deleteClass($id = null)
    {
        if (!$id) return $this->fail('ID tidak valid.', 400);
        $kelasModel = new KelasModel();
        $kelasModel->delete($id);
        return $this->respond(['status' => 'success', 'message' => 'Data kelas berhasil dihapus.']);
    }

    // GET /api/logs
    public function getLogs()
    {
        $peminjamanModel = new PeminjamanModel();
        $rawLogs = $peminjamanModel->orderBy('borrow_time', 'DESC')->findAll();
        $logs = [];

        foreach ($rawLogs as $log) {
            $logs[] = [
                'id'                => $log['id'],
                'unitId'            => $log['unit_id'],
                'unit_id'           => $log['unit_id'],
                'unitName'          => $log['unit_name'],
                'unit_name'         => $log['unit_name'],
                'teacherName'       => $log['teacher_name'],
                'teacher_name'      => $log['teacher_name'],
                'destinationClass'  => $log['destination_class'],
                'destination_class' => $log['destination_class'],
                'subject'           => $log['subject'] ?? 'PBM Multimedia',
                'durationPeriod'    => $log['duration_period'],
                'duration_period'   => $log['duration_period'],
                'borrowTime'        => $log['borrow_time'],
                'borrow_time'       => $log['borrow_time'],
                'returnTime'        => $log['return_time'],
                'return_time'       => $log['return_time'],
                'status'            => $log['status'],
                'checklist'         => is_string($log['checklist_borrow']) ? json_decode($log['checklist_borrow'], true) : ($log['checklist_borrow'] ?? []),
                'returnChecklist'   => is_string($log['checklist_return']) ? json_decode($log['checklist_return'], true) : $log['checklist_return'],
                'conditionOnReturn' => $log['condition_return'],
                'complaints'        => is_string($log['complaints']) ? json_decode($log['complaints'], true) : ($log['complaints'] ?? []),
                'complaintNote'     => $log['complaint_note'],
                'needsDirectAction' => !empty($log['needs_direct_action']),
                'notes'             => $log['notes'] ?? '',
                'hoursUsed'         => (float)($log['hours_used'] ?? 2.0),
            ];
        }

        return $this->respond([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    // POST /api/borrow
    public function borrow()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $unitId           = $input['unitId'] ?? null;
        $teacherName      = $input['teacherName'] ?? null;
        $destinationClass = $input['destinationClass'] ?? null;
        $durationPeriod   = $input['durationPeriod'] ?? 'Jam ke-1';
        $checklist        = $input['checklist'] ?? [];
        $notes            = $input['notes'] ?? '';

        if (!$unitId || !$teacherName || !$destinationClass) {
            return $this->fail('Unit, Guru, dan Kelas wajib diisi.', 400);
        }

        $proyektorModel = new ProyektorModel();
        $peminjamanModel = new PeminjamanModel();

        $projector = $proyektorModel->find($unitId);
        if (!$projector) {
            return $this->failNotFound("Unit $unitId tidak ditemukan.");
        }

        if ($projector['status'] === 'dipinjam') {
            return $this->fail("Unit $unitId sedang dipinjam.", 400);
        }

        $logId = 'LOG-' . date('Ymd-His');
        $borrowTime = date('Y-m-d H:i:s');

        // Create transaction log
        $peminjamanModel->insert([
            'id'                => $logId,
            'unit_id'           => $unitId,
            'unit_name'         => $projector['name'],
            'teacher_name'      => trim($teacherName),
            'destination_class' => trim($destinationClass),
            'subject'           => 'PBM Multimedia',
            'duration_period'   => $durationPeriod,
            'borrow_time'       => $borrowTime,
            'return_time'       => null,
            'status'            => 'aktif',
            'checklist_borrow'  => json_encode($checklist),
            'checklist_return'  => null,
            'condition_return'  => null,
            'notes'             => trim($notes),
            'hours_used'        => 2.0,
        ]);

        // Update projector status
        $proyektorModel->update($unitId, [
            'status' => 'dipinjam',
        ]);

        return $this->respondCreated([
            'status'  => 'success',
            'message' => 'Peminjaman berhasil dicatat.',
            'logId'   => $logId,
        ]);
    }

    // POST /api/return
    public function returnProjector()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $unitId            = $input['unitId'] ?? null;
        $returnChecklist   = $input['returnChecklist'] ?? [];
        $conditionOnReturn = $input['conditionOnReturn'] ?? 'baik';
        $complaints        = $input['complaints'] ?? [];
        $complaintNote     = $input['complaintNote'] ?? '';
        $needsDirectAction = !empty($input['needsDirectAction']);
        $notes             = $input['notes'] ?? '';

        if (!$unitId) {
            return $this->fail('Unit ID wajib disertakan.', 400);
        }

        $proyektorModel  = new ProyektorModel();
        $peminjamanModel = new PeminjamanModel();
        $komplainModel   = new KomplainModel();

        $projector = $proyektorModel->find($unitId);
        if (!$projector) {
            return $this->failNotFound("Unit $unitId tidak ditemukan.");
        }

        $activeLog = $peminjamanModel
            ->where('unit_id', $unitId)
            ->where('status', 'aktif')
            ->orderBy('borrow_time', 'DESC')
            ->first();

        $returnTime = date('Y-m-d H:i:s');
        $hoursUsed = 2.0;

        if ($activeLog) {
            $borrowTs = strtotime($activeLog['borrow_time']);
            $returnTs = strtotime($returnTime);
            $hoursUsed = round(max(0.5, ($returnTs - $borrowTs) / 3600), 2);

            $peminjamanModel->update($activeLog['id'], [
                'return_time'         => $returnTime,
                'status'              => 'selesai',
                'checklist_return'    => json_encode($returnChecklist),
                'condition_return'    => $conditionOnReturn,
                'complaints'          => json_encode($complaints),
                'complaint_note'      => $complaintNote,
                'needs_direct_action' => $needsDirectAction ? 1 : 0,
                'notes'               => $notes ?: $activeLog['notes'],
                'hours_used'          => $hoursUsed,
            ]);

            // If complaints filed, log into komplain_sarpras
            if (!empty($complaints) || !empty($complaintNote)) {
                $complaintSummary = implode(', ', $complaints);
                if ($complaintNote) {
                    $complaintSummary .= ($complaintSummary ? ' | Catatan: ' : '') . $complaintNote;
                }
                $komplainModel->insert([
                    'loan_id'        => $activeLog['id'],
                    'unit_id'        => $unitId,
                    'complaint_type' => $complaintSummary ?: 'Keluhan Operasional',
                    'notes'          => $complaintNote,
                    'is_resolved'    => 0,
                ]);
            }
        }

        // Update projector status: maintenance if broken or direct action required
        $newStatus = ($conditionOnReturn === 'rusak' || $needsDirectAction) ? 'maintenance' : 'tersedia';
        $proyektorModel->update($unitId, [
            'status' => $newStatus,
        ]);

        return $this->respond([
            'status'    => 'success',
            'message'   => 'Pengembalian proyektor berhasil diproses.',
            'newStatus' => $newStatus,
        ]);
    }

    // POST /api/resolve-complaint
    public function resolveComplaint()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $unitId     = $input['unitId'] ?? null;
        $resolvedBy = $input['resolvedBy'] ?? 'Tim Sarpras';

        if (!$unitId) {
            return $this->fail('Unit ID wajib diisi.', 400);
        }

        $proyektorModel = new ProyektorModel();
        $komplainModel  = new KomplainModel();

        // Mark complaints as resolved
        $komplainModel
            ->where('unit_id', $unitId)
            ->where('is_resolved', 0)
            ->set([
                'is_resolved' => 1,
                'resolved_at' => date('Y-m-d H:i:s'),
                'resolved_by' => $resolvedBy,
            ])
            ->update();

        // Reset projector status to tersedia
        $proyektorModel->update($unitId, [
            'status'           => 'tersedia',
            'last_maintenance' => date('Y-m-d'),
        ]);

        return $this->respond([
            'status'  => 'success',
            'message' => "Keluhan unit $unitId telah ditandai selesai diperbaiki.",
        ]);
    }
}
