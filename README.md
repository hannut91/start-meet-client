ng build -prod
aws s3 rm s3://www.startmeet.me/ --include "*" --recursive --region ap-northeast-2
aws s3 cp dist s3://www.startmeet.me/ --recursive --exclude ".DS_Store" --acl public-read-write --region ap-northeast-2

