const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DATABASE_TABLE_NAME;

const MAX_GET_PLAYERS_PAGE_SIZE = 200
const DEFAULT_GET_PLAYERS_PAGE_SIZE = 50

const getPlayers = async (event) => {
  try {
    const pageSize = parseInt(event.queryStringParameters && event.queryStringParameters.pageSize) || DEFAULT_GET_PLAYERS_PAGE_SIZE;

    const exclusiveStartKeyPlayerID = event.queryStringParameters && event.queryStringParameters.exclusiveStartKeyPlayerID;
    const exclusiveStartKeyNameLast = event.queryStringParameters && event.queryStringParameters.exclusiveStartKeyNameLast;

    const params = {
      TableName: tableName,
      Limit: pageSize > MAX_GET_PLAYERS_PAGE_SIZE ? MAX_GET_PLAYERS_PAGE_SIZE : pageSize,
      ExclusiveStartKey: exclusiveStartKeyPlayerID && exclusiveStartKeyNameLast ? {"playerID":exclusiveStartKeyPlayerID,"nameLast":exclusiveStartKeyNameLast} : undefined,
      ScanIndexForward: true,
    };

    const result = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
      }),
    };
  } catch (error) {
    console.error('Error retrieving players:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

const getPlayersBetweenLastNames = async (event) => {
  const lastNameStart = event.queryStringParameters && event.queryStringParameters.lastNameStart;
  const lastNameEnd = event.queryStringParameters && event.queryStringParameters.lastNameEnd;

  const params = {
    TableName: tableName,
    KeyConditionExpression: "#nameLast BETWEEN :lastNameStartValue AND :lastNameEndValue",
    ExpressionAttributeNames: {
      "#nameLast": "nameLast"
    },
    ExpressionAttributeValues: {
      ":lastNameStartValue": lastNameStart,
      ":lastNameEndValue": lastNameEnd
    }
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items?.map((item) => item);
}

const getPlayerById = async (event) => {
  try {
    const playerId = event.pathParameters.playerID;
    if (!playerId) {
      return {
        statusCode: 403,
        body: 'Player ID not supplied',
      };
    }

    const params = {
      TableName: tableName,
      KeyConditionExpression: "#playerId = :playerIdValue",
      ExpressionAttributeNames: {
        "#playerId": "playerID"
      },
      ExpressionAttributeValues: {
        ":playerIdValue": playerId
      }
    };

    const result = await dynamoDB.query(params).promise();

    if (!result.Items.length) {
      return {
        statusCode: 404,
        body: 'Player not found',
      };
    }

    return {
      statusCode: 200,
      // At least one player was found (Since looking for primary key then also at most)
      body: JSON.stringify(result.Items[0]),
    };
  } catch (error) {
    console.error('Error retrieving player by ID:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

const getPlayersPath = "/api/players"
const getPlayerByIdPath = "/api/players/"
const getPlayersBetweenLastNamesPath = "/api/playersbetweenlastnames"

exports.handler = async (event) => {
  if(event.path.includes(getPlayersBetweenLastNamesPath)) {
    return {
      statusCode: 500,
      body: 'API under maintenance',
    };
  } else if(event.path.includes(getPlayerByIdPath)) {
    return getPlayerById(event);
  } else if(event.path.includes(getPlayersPath)) {
    return getPlayers(event);
  }
};
