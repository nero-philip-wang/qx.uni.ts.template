$param = @{
    Uri         = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=55c6f3e5-7872-422d-92cf-b674b499edbe"
    Method      = "Post"
    Body        = [System.Text.Encoding]::UTF8.GetBytes('{"msgtype": "text","text": {"content": "新导购端-测试环境已发布：http://nightly.bebefocus.com/static/link"}}')
    ContentType = "application/json"
}
Invoke-RestMethod @param