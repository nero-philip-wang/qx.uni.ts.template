$old = $pwd.Path
echo '已设置微信开发者工具目录'$env:wxcli
cd $env:wxcli
$current = $old + "\dist\dev\mp-weixin"
echo $current 

./cli.bat open --project $current
pause