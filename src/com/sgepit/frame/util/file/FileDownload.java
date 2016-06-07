package com.sgepit.frame.util.file;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccAttachListId;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.util.JdbcUtil;

public class FileDownload extends MainServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		String method = request.getParameter("method")==null?"":request.getParameter("method");
		if(method.equals("fileDownload")){
			fileDownload(request, response);
		}else if(method.equals("fileBlobDownload")){
			fileBlobDownload(request, response);
		}else if(method.equals("downLoadHelpFile")){
			downLoadHelpFile(request, response);
		}else if(method.equals("getAttachList")){
			getAttachList(request, response);
		}
	}	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doGet(request, response);
	}
	
	/**
	 * 根据transId，transType,helpType下载文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:48:14
	 */
	private void downLoadHelpFile(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			String transId = request.getParameter("transId");
			String transType = request.getParameter("transType");
			String helpType = request.getParameter("helpType");
			List list = JdbcUtil.query("select file_lsh from sgcc_attach_list where transaction_type = '"+transType+"' and transaction_id = '"+transId+"' and file_type = '"+helpType+"'");
			if(list.size()==1){
				Map map = (Map) list.get(0);
				fileDownloadByFileId(map.get("file_lsh").toString(),request,response);
			}else{
				response.sendError(404);
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	/**
	 * 根据fileLsh下载文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:50:07
	 */
	private void fileDownload(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			String id = request.getParameter("id");
			fileDownloadByFileId(id,request,response);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	/**
	 * 根据fileLsh下载文档
	 * @param fileLsh
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:50:25
	 */
	private void fileDownloadByFileId(String fileLsh,HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			FileUtil fileUtil = new FileUtil();
			fileUtil.fileDownload(response, fileLsh,null);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}	
	/**
	 * 下载文档，不关联sgcc_attach_list
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:50:43
	 */
	private void fileBlobDownload(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			String id = request.getParameter("fileLshInput")==null?"":request.getParameter("fileLshInput"); 
			String fileName = request.getParameter("fileNameInput")==null?"":request.getParameter("fileNameInput"); 
			String fileSource = request.getParameter("filesource")==null?"blob":request.getParameter("filesource"); 			
			String compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
			String transType = request.getParameter("transType")==null?"other":request.getParameter("transType");
			String tableName = request.getParameter("tableName")==null?"sgcc_attach_blob":request.getParameter("tableName");
			if(id.equals("")){
				id = request.getParameter("id");
			}
			if(fileName.equals("")){
				fileName = request.getParameter("fileName")==null?"":request.getParameter("fileName"); 
			}			
			//fileName = new String(fileName.getBytes("iso-8859-1"),"utf-8");	
			
			SgccAttachList attachInput = new SgccAttachList();
			SgccAttachListId attachId = new SgccAttachListId();
			attachId.setFileLsh(id);
			attachId.setTransactionType(transType);			
			attachInput.setId(attachId);
			attachInput.setFileName(fileName);
			attachInput.setFileSource(fileSource);
			attachInput.setIsCompress(compress);
			attachInput.setBlobTable(tableName);			
			FileUtil fileUtil = new FileUtil();			
			fileUtil.fileDownload(response, id, attachInput);
			
		}catch(Exception ex) {
			ex.printStackTrace();
		}
	}	
	private void getAttachList(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String whereStr = (request.getParameter("whereStr") == null ? "1=1" : request.getParameter("whereStr"));
		whereStr = transStrIso8859ToUtf8(whereStr);
		Integer start = request.getParameter("start") != null ? Integer.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer.valueOf(request.getParameter("limit")) : null;
		FileManagementService fileService= (FileManagementService) Constant.wact.getBean("fileServiceImpl");
		List<SgccAttachList> list = fileService.geAttachListByWhere(whereStr,start,limit);
		String jsonStr = makeJsonDataForGrid(list);
		System.out.println(jsonStr);
		outputStr(response, jsonStr);		
	}	
	private String transStrIso8859ToUtf8(String str) throws UnsupportedEncodingException{
		String rtnStr = new String(str.getBytes("iso-8859-1"),"utf-8"); 		
		return  rtnStr;
	}
}