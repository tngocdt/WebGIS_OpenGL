<?php 
    include('./connection/connect.php');
    
    // Trong phần này ta thay thế "__" bằng tên thuôc tính mình cần tìm kiếm

    if(isset($_GET['tenhc'])){
        $tenhc = $_GET['tenhc'];
        $name = strtolower($tenhc);
        // Trong câu lệnh phía dưới ta thay "---" là tên bảng chứa thuộc tính mình muốn tìm kiếm
        $query = "select *,st_x(ST_Centroid(geom)) as x,st_y(ST_Centroid(geom)) as y from public.vunghanhchinh_nb where LOWER(tenhc) like '%$name%'";
        $result = pg_query($conn, $query);
        $tong_so_ket_qua = pg_num_rows($result);

        if($tong_so_ket_qua > 0) {
            while($dong = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $link = "<a href='javascript:void(0);' onclick='di_den_diem(".$dong['x'].",".$dong['y'].")'>Xem ngay</a>";
                // Trong câu lệnh phía dưới mình thay phần "-----" là tên bảng chứa diện tích của đối tượng tìm kiếm
                print("Tên HC: ".$dong['tenhc']." | Diện tích: ".$dong['dientich']." ".$link."</br>");
            }
        }else {
            print("Not found");
        }
    }else {
        echo "Not Found";
    }

?>