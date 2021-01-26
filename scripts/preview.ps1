try {
    $old = $pwd.Path
    $current = $pwd.Path + "\build\dev\mp-weixin"
    $output = $pwd.Path + "\1.jpg"

    cd $env:wxcli
    
    ./cli.bat preview --project $current --qr-format image --qr-output $output

    $file = [System.IO.File]::ReadAllBytes($output)
    $base64 = [System.Convert]::ToBase64String($file)

    $md5 = Get-FileHash $output -Algorithm MD5
    $md5 = $md5.Hash   

    $param = @{
        Uri         = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=55c6f3e5-7872-422d-92cf-b674b499edbe"
        Method      = "Post"
        Body        = [System.Text.Encoding]::UTF8.GetBytes('{"msgtype": "image","image": {"base64": "' + $base64 + '","md5": "' + $md5 +'"}}')
        ContentType = "application/json"
    }
    Invoke-RestMethod @param

    $param = @{
        Uri         = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=55c6f3e5-7872-422d-92cf-b674b499edbe"
        Method      = "Post"
        Body        = [System.Text.Encoding]::UTF8.GetBytes('{"msgtype": "text","text": {"content": "新导购端-测试环境已发布,请扫上面的二维码"}}')
        ContentType = "application/json"
    }
    Invoke-RestMethod @param
}
catch {
    
}
finally {
    cd $old
}