-- ตรวจสอบข้อมูลโครงการ ID 8
USE projectkunpitch;

-- ดูข้อมูลหลักของโครงการ
SELECT 
    id,
    name_th,
    project_type,
    building_type,
    selected_stations,
    seo_title,
    seo_description,
    seo_keywords,
    video_review_2,
    official_website_2,
    created_at,
    updated_at
FROM projects 
WHERE id = 8;

-- ดูข้อมูล facilities
SELECT 
    pf.project_id,
    pf.facility_id,
    p.name_th as project_name
FROM project_facilities pf
JOIN projects p ON pf.project_id = p.id
WHERE pf.project_id = 8;

-- ดูข้อมูล amenities
SELECT 
    pa.project_id,
    pa.amenity_id,
    p.name_th as project_name
FROM project_amenities pa
JOIN projects p ON pa.project_id = p.id
WHERE pa.project_id = 8;

-- ดูข้อมูลรูปภาพ
SELECT 
    pi.project_id,
    pi.image_url,
    pi.image_order,
    pi.is_cover,
    p.name_th as project_name
FROM project_images pi
JOIN projects p ON pi.project_id = p.id
WHERE pi.project_id = 8
ORDER BY pi.image_order;

-- ตรวจสอบโครงสร้างตาราง projects
DESCRIBE projects;
























