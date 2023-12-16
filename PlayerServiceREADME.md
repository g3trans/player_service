
### For non TTY terminal (MINGW64
### (Care as it will automate everything)
npx cdk deploy --require-approval never

### Test devo (recent deployment)
https://ak83tq3vnf.execute-api.us-east-1.amazonaws.com/devo/api/players
https://ak83tq3vnf.execute-api.us-east-1.amazonaws.com/devo/api/players/bellmi01
- Unfortunately dynamodb scan doesn't return sorted results, for pagination we require the composite Primary/Sorted LastEvaluatedKey returned from get players
https://ak83tq3vnf.execute-api.us-east-1.amazonaws.com/devo/api/players?exclusiveStartKeyPlayerID=bergmch01&exclusiveStartKeyNameLast=Bergman
- (Gal: I would've liked to switch from DDB to SQL based, and then implement additional APIs for complex queries which would be more efficient than on ddb.
- (GSIs are supposedly expensive)

### Database appears to be baseball players 
- It's likely that traffic for obtaining statistics about the players will not be uniformly distributed. So ideally we'll have caching and need to consider DDB / Redis for risks of hot partitions..

### note:
- pre batching backfill, 150 entries 8~ seconds (at 5 rcu 200 entry bf hits 9rcu)
- https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2?graph=~(view~'timeSeries~stacked~false~region~'us-east-1~metrics~(~(~'AWS*2fDynamoDB~'ConsumedWriteCapacityUnits~'TableName~'DevoStack-PlayerServiceDatabase-DOFJEEKHDXYI-PlayersDatabaseEDFD32E5-W53ZLBDWV25R)))&query=~'*7bAWS*2fDynamoDB*2cTableName*7d
- post batching limiting rate to 23.5wcu,  3k entries at 4~ min
### Todo:
- Switch to 
- Have backfill utilize kinesis for burst wcu
- Model the API responses
- Cache the most popular players, verify ddb hot partitions isn't an issue