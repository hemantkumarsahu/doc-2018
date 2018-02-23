
/**
 * @api {post} /noauth/generatePdf Generate PDF
 * @apiGroup PDF
 * @apiParam {string} template Comma Separated Template Ids 
 * @apiParam {string} name Name for document
 * @apiParam {string} description Description for Document
 * @apiParam {string} owner Template owner User Id
 * @apiParam {Object} templateData Object of template data with template Ids as keys
 * @apiParamExample {json} Input
 * {
 *		"template":"57fe07896724bf7277691ed2,57fe078967s23f7277691ed2",
 *		"name":"testing",
 *		"description":"tesing now",
 *		"owner" : "57f77602afc9264ce2430b26",
 *		"templateData": {
 *			"57fe07896724bf7277691ed2":{
 *				"First Name": "Sagar",
 *				"Last Name":"Mahajan"
 *			},
 * 			"57fe07896724bf7277691ed2":{
 *				"First Name": "Sagar",
 *				"Last Name":"Mahajan"
 *			}
 *		}
 *		
 *	}
 * @apiSuccess {String} status Status of Operation
 * @apiSuccess {String} message Error or Success Message
 * @apiSuccess {String} trackingURL Tracking url of file generated
 * @apiSuccess {String} naturalURL Natural url of file generated
 * @apiSuccess {String} fileId File Id
 * @apiSuccessExample {json} Success
 *    	HTTP/1.1 200 OK
 *    	{
 *		  "status": "success",
 *		  "message": "Saved Successfully",
 *		  "trackingURL": "",
 *		  "naturalURL": "",
 *		  "fileId": ""
 *		}
 * @apiErrorExample {json} List error
 *    	HTTP/1.1 500 Internal Server Error
 *		{
 *		  "status": "error",
 *		  "message": " error message ",
 *		  "trackingURL": "",
 *		  "naturalURL": "",
 *		  "fileId": ""
 *		}
 */
