package com.sgepit.frame.flow.control;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.jspsmart.upload.File;
import com.jspsmart.upload.SmartUpload;
import com.jspsmart.upload.SmartUploadException;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwAdjunctIns;
import com.sgepit.frame.flow.hbm.FlwDefinitionView;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFilesIns;
import com.sgepit.frame.flow.hbm.FlwNodeView;
import com.sgepit.frame.flow.service.FlwFrameMgmFacade;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.DateUtil;

public class FlwServlet extends MainServlet
{

    public FlwServlet()
    {
    	frameBean = "com.sgepit.frame.flow.hbm.".concat("FlwFrame");
    	defBean = "com.sgepit.frame.flow.hbm.".concat("FlwDefinitionView");
    	nodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodeView");
    	pathViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodePathView");
    	cnodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNode");
        cpathBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePath");
        fileBean = "com.sgepit.frame.flow.hbm.".concat("FlwFiles");
    	
        fileInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFilesIns");
        adjunctInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwAdjunctIns");
    }

    public void destroy()
    {
        super.destroy();
    }

    public void init(ServletConfig config)
        throws ServletException
    {
        servletConfig = config;
        javax.servlet.ServletContext servletContext = config.getServletContext();
        wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
        baseMgm = (BaseMgmFacade)wac.getBean("baseMgm");
        flwFrameMgm = (FlwFrameMgmFacade)wac.getBean("flwFrameMgm");
        appMgm = (ApplicationMgmFacade)wac.getBean("applicationMgm");
        baseDao = (BaseDAO)wac.getBean("systemDao");
        flowDao = (FlowDAO)wac.getBean("flowDAO");
        
//        SessionFactory sessionFactory = (SessionFactory)wac.getBean("sessionFactory1");
//        BusinessConstants.ENTITYBEANS = sessionFactory.getAllClassMetadata();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        doPost(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        String method;
        method = request.getParameter("ac");
        try
        {
        if(method == null)
            return;
        if(method.equalsIgnoreCase("saveDoc"))
        {
            saveDoc(request, response);
            return;
        }
        if(method.equalsIgnoreCase("loadDoc"))
        {
            loadDoc(request, response);
            return;
        }
        if(method.equalsIgnoreCase("deleteDoc"))
        {
            deleteDoc(request, response);
            return;
        }
        if(method.equalsIgnoreCase("uploadModelDoc"))
        {
            uploadModelDoc(request, response);
            return;
        }
        if(method.equalsIgnoreCase("downloadModelDoc"))
        {
            downloadModelDoc(request, response);
            return;
        }
        if(method.equalsIgnoreCase("saveFrame"))
        {
            String frameid = request.getParameter("frameid");
            String framename =  (String)request.getParameter("framename");
            framename = URLDecoder.decode(framename, "UTF-8");
//            String framename =  new String(request.getParameter("framename").getBytes("ISO-8859-1"),"utf-8");
            String unitid = (String) request.getSession().getAttribute(Constant.USERBELONGUNITID);
            flwFrameMgm.saveOrUpdateFlwFrame(frameid, framename, unitid);
            return;
        }
        if(method.equalsIgnoreCase("uploadSign"))
        {
            uploadSign(request, response);
            return;
        }
        if(method.equalsIgnoreCase("downloadSign"))
        {
            downloadSign(request, response);
            return;
        }
        if(method.equalsIgnoreCase("uploadAdjunct"))
        {
            uploadAdjunct(request, response);
            return;
        }
        if(method.equalsIgnoreCase("deleteAdjunct"))
        {
            deleteAdjunct(request, response);
            return;
        }
        if(method.equalsIgnoreCase("loadAdjunct"))
        {
            loadAdjunct(request, response);
            return;
        }
        if(method.equalsIgnoreCase("loadFile"))
        {
            loadFile(request, response);
            return;
        }
        if(method.equalsIgnoreCase("downflwdef"))
        {
        	exportFlwDefinitions(request, response);
        	return;
        }
        
        if(method.equalsIgnoreCase("importflwdef"))
        {
        	importFlwDefinitions(request, response);
        	return;
        }
        
        if(method.equalsIgnoreCase("extUpload"))
        {
            extUpload(request, response);
            return;
        }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
    }

    private void saveDoc(HttpServletRequest request, HttpServletResponse response)
        throws Exception
    {
    	String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
        SmartUpload mySmartUpload;
        String fileid;
        String filename;
        StringBuilder msg;
        File myFile;
        String proFile;
        int i;
        mySmartUpload = new SmartUpload();
        mySmartUpload.initialize(servletConfig, request, response);
        try
        {
            mySmartUpload.upload();
        }
        catch(SmartUploadException e)
        {
            e.printStackTrace();
        }
        fileid = "";
        filename = "";
        msg = null;
        myFile = null;
        proFile = request.getParameter("proFile");
        fileid = mySmartUpload.getRequest().getParameter("fileid");
        System.out.println((new StringBuilder("fileid=")).append(fileid).toString());
        i = 0;
        while (i < mySmartUpload.getFiles().getCount()) {
	        int file_size;
	        java.io.File file;
	        String file_id;
	        boolean flag;
	        myFile = mySmartUpload.getFiles().getFile(i++);
	        System.out.println((new StringBuilder("File=")).append(myFile.getFileName()).toString());
	        if(myFile.isMissing())
	            continue;
	        filename = myFile.getFileName();
	        file_size = myFile.getSize();
	        file = new java.io.File(uploadTempFolder.concat("/")+filename);
	        flag = false;
//	        if(!myFile.getFieldName().equalsIgnoreCase("EDITFILE")) {
	        try
	        {
	            myFile.saveAs(file.getAbsolutePath(), 2);
	        }
	        catch(SmartUploadException e)
	        {
	            e.printStackTrace();
	        }
	        if(fileid == null || fileid.length() == 0)
	        {
	            String insid = mySmartUpload.getRequest().getParameter("insid");
	            String nodeid = mySmartUpload.getRequest().getParameter("nodeid");
	            String userid = mySmartUpload.getRequest().getParameter("userid");
	            List list = baseDao.findByWhere2(fileInsBean, (new StringBuilder("insid='")).append(insid).append("'and nodeid='").append(nodeid).append("'and userid='").append(userid).append("'").toString());
	            if(list.isEmpty())
	            {
	                FlwFiles flwFile = new FlwFiles();
	                flwFile.setFilename(filename);
	                flwFile.setFilesize(new Long(file_size));
	                flwFile.setFiledate(DateUtil.getSystemDateTime());
	                //baseDao.insert(flwFile);
	                baseMgm.insert("baseMgm", "", "insert", flwFile);
	                FlwFilesIns flwFilesIns = new FlwFilesIns();
	                flwFilesIns.setFileid(flwFile.getFileid());
	                flwFilesIns.setInsid(insid);
	                flwFilesIns.setNodeid(nodeid);
	                flwFilesIns.setUserid(userid);
	                flwFilesIns.setIsmove("0");
	                //baseDao.insert(flwFilesIns);
	                baseMgm.insert("baseMgm", "", "insert", flwFilesIns);
	                flag = true;
	                file_id = flwFile.getFileid();
	            } else
	            {
	                file_id = ((FlwFilesIns)list.get(0)).getFileid();
	            }
	        } else
	        {
	            file_id = fileid;
	        }
	        
	        try
	        {
	                flowDao.saveFileToBlob(file_id, new FileInputStream(file), file_size, flag);
	        }
	        catch(SQLException e)
	        {
	        	 e.printStackTrace();
	             msg = new StringBuilder();
	             msg.append("文件另存为失败！<br>");
	             msg.append("错误原因：");
	             msg.append((new StringBuilder("&nbsp;&nbsp;")).append(e.getMessage()).toString());
	        }
	        
	        msg = new StringBuilder();
	        msg.append("保存成功！ ");
	        msg.append((new StringBuilder("在线编辑的文件: 《")).append(filename).append("》  ").toString());
	        msg.append((new StringBuilder("大小: ")).append(file_size).append(" bytes").toString());
	        file.delete();
        }
        if(msg != null)
        {
            response.setCharacterEncoding("GB2312");
            PrintWriter pw = response.getWriter();
            pw.print(msg.toString());
            pw.flush();
            pw.close();
        }
        return;
    }

    private void loadDoc(HttpServletRequest request, HttpServletResponse response)
    {
        String fileid = request.getParameter("fileid");
        try
        {
            OutputStream os = response.getOutputStream();
            InputStream is = flowDao.getFileBlob(fileid);
            byte buf[] = new byte[8096];
            for(int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
                os.write(buf, 0, bytes);

            os.flush();
            os.close();
            is.close();
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
        catch(SQLException e)
        {
            e.printStackTrace();
        }
        catch(BusinessException e)
        {
            e.printStackTrace();
        }
    }

    private void deleteDoc(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        String fileid;
        response.setContentType("text/html; charset=utf-8");
        info = "{success: true, msg: '成功删除流程实例文件！'}";
        fileid = request.getParameter("fileid");
        try
        {
            FlwFiles file = (FlwFiles)baseDao.findById(fileBean, fileid);
            baseDao.delete(file);
            FlwFilesIns fileins = (FlwFilesIns)baseDao.findById(fileInsBean, fileid);
            baseDao.delete(fileins);
            flowDao.deleteFileInBlob(fileid);
        }
        catch(RuntimeException e)
        {
            info = (new StringBuilder("{success: false, msg: '错误原因：")).append(e.getMessage()).append("'}").toString();
            e.printStackTrace();
        }
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }

    private void uploadModelDoc(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        int count;
        response.setContentType("text/html; charset=utf-8");
        info = "{success: true, msg: '文件上传成功！'}";
        count = 0;
        try
        {
            String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
            log.debug((new StringBuilder("file uploading begin at ")).append(DateUtil.getSystemDateTimeStr("yyyy-MM-dd HH:mm:ss")).append(". using temp folder: ").append(uploadTempFolder).toString());
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(4096);
            factory.setRepository(new java.io.File(uploadTempFolder));
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(0x3200000L);
            upload.setHeaderEncoding("utf-8");
            HashMap fieldMap = new HashMap();
            HashMap fileMap = new HashMap();
            List fileItems = upload.parseRequest(request);
            for(Iterator iter = fileItems.iterator(); iter.hasNext();)
            {
                FileItem item = (FileItem)iter.next();
                String fieldName = item.getFieldName();
                if(item.isFormField())
                {
                    if(fieldName != null && fieldName.indexOf("fileid") > -1 && fieldMap.get(fieldName) == null)
                        fieldMap.put(fieldName, item.getString());
                } else
                if(fieldMap.get(fieldName) == null)
                {
                    fieldMap.put(fieldName, item.getName().split("\\\\")[item.getName().split("\\\\").length - 1]);
                    fileMap.put(fieldName, item);
                }
            }

            for(Iterator itr = fieldMap.entrySet().iterator(); itr.hasNext();)
            {
                java.util.Map.Entry entry = (java.util.Map.Entry)itr.next();
                String key = ((String)entry.getKey()).toString();
                String value = (String)entry.getValue();
                if(value != null && !value.equals(""))
                {
                    FileItem item = (FileItem)fileMap.get(key);
                    String msg = "ok";
                    try
                    {
                        String flowid = request.getParameter("flowid");
                        List list = baseDao.findByWhere2(fileBean, (new StringBuilder("nodeid='")).append(item.getFieldName()).append("' and flowid='").append(flowid).append("'").toString());
                        boolean isNew = true;
                        FlwFiles flwfile;
                        if(list.isEmpty())
                        {
                            flwfile = new FlwFiles();
                        } else
                        {
                            isNew = false;
                            flwfile = (FlwFiles)list.get(0);
                        }
                        flwfile.setFilename((String)fieldMap.get(item.getFieldName()));
                        flwfile.setFilesize(Long.valueOf(item.getSize()));
                        flwfile.setFiledate(DateUtil.getSystemDateTime());
                        flwfile.setNodeid(item.getFieldName());
                        flwfile.setFlowid(flowid);
                        baseDao.saveOrUpdate(flwfile);
                        flowDao.saveFileToBlob(flwfile.getFileid(), item.getInputStream(), (int)item.getSize(), isNew);
                        count++;
                    }
                    catch(Exception ex)
                    {
                        msg = ex.getMessage();
                    }
                }
            }
        }
        catch(Exception ex)
        {
            info = (new StringBuilder("{success: false, msg: '上传失败！<br>失败原因：")).append(ex.getMessage()).append("'}").toString();
        }
        info = (new StringBuilder("{success: true, msg: '成功上传（")).append(count).append("）文件！'}").toString();
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }

    private void downloadModelDoc(HttpServletRequest request, HttpServletResponse response)
    {
        String nodeid = request.getParameter("nodeid");
        String flowid = request.getParameter("flowid");
        String msg = "";
        if(nodeid == null || flowid == null)
        {
            msg = "缺少参数！";
        } else
        {
            FlwFiles file = (FlwFiles)baseDao.findByWhere2(fileBean, (new StringBuilder("nodeid='")).append(nodeid).append("' and flowid='").append(flowid).append("'").toString()).get(0);
            if(file == null)
                msg = "文件不存在！";
            else
                try
                {
                    InputStream is = flowDao.getFileBlob(file.getFileid());
                    if(is == null)
                    {
                        msg = (new StringBuilder("文件缺失：")).append(file.getFileid()).toString();
                    } else
                    {
                        String filename = new String(file.getFilename().getBytes("GBK"), "ISO-8859-1");
                        response.reset();
                        response.setContentType("application/vnd.ms-word");
                        response.setHeader("Content-disposition", (new StringBuilder("attachment; filename=")).append(filename).toString());
                        ServletOutputStream os = response.getOutputStream();
                        byte buf[] = new byte[8096];
                        for(int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
                            os.write(buf, 0, bytes);

                        os.flush();
                        os.close();
                        is.close();
                    }
                }
                catch(Exception e)
                {
                    e.printStackTrace();
                    msg = e.getMessage();
                }
        }
    }

    private void uploadSign(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        response.setContentType("text/html; charset=utf-8");
        info = "{success: true, msg: '文件上传成功！'}";
        try
        {
            String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
            log.debug((new StringBuilder("file uploading begin at ")).append(DateUtil.getSystemDateTimeStr("yyyy-MM-dd HH:mm:ss")).append(". using temp folder: ").append(uploadTempFolder).toString());
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(4096);
            factory.setRepository(new java.io.File(uploadTempFolder));
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(0x3200000L);
            upload.setHeaderEncoding("utf-8");
            HashMap fieldMap = new HashMap();
            HashMap fileMap = new HashMap();
            List fileItems = upload.parseRequest(request);
            for(Iterator iter = fileItems.iterator(); iter.hasNext();)
            {
                FileItem item = (FileItem)iter.next();
                String fieldName = item.getFieldName();
                if(item.isFormField())
                {
                    if(fieldName != null && fieldName.indexOf("fileid") > -1 && fieldMap.get(fieldName) == null)
                        fieldMap.put(fieldName, item.getString());
                } else
                if(fieldMap.get(fieldName) == null)
                {
                    fieldMap.put(fieldName, item.getName().split("\\\\")[item.getName().split("\\\\").length - 1]);
                    fileMap.put(fieldName, item);
                }
            }

            for(Iterator itr = fieldMap.entrySet().iterator(); itr.hasNext();)
            {
                java.util.Map.Entry entry = (java.util.Map.Entry)itr.next();
                String key = ((String)entry.getKey()).toString();
                String value = (String)entry.getValue();
                if(value != null && !value.equals(""))
                {
                    FileItem item = (FileItem)fileMap.get(key);
                    String msg = "ok";
                    try
                    {
                    	String fieldName = item.getFieldName();
                    	String ac = request.getParameter("ac");
                    	String order = fieldName.replace(ac, "");
                    	String userid = request.getParameter("userid");
                    	JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
                    	if(order==null||order.isEmpty()||order.equals("0")){
	                        List list = jdbcTemplate.queryForList((new StringBuilder("select * from app_blob where FILEID='")).append(userid).append("'").toString());
	                        flowDao.saveFileToBlob(userid, item.getInputStream(), (int)item.getSize(), list.isEmpty());
                    	}else{
                    		String business = userid+"-"+order;
	                        List<AppFileinfo> list = flowDao.findByWhere(AppFileinfo.class.getName(), "businessid='"+business+"'");
	                        AppFileinfo appFileinfo = (list.size() > 0) ? list.get(0) : new AppFileinfo();
	                        appFileinfo.setFilename((String)fieldMap.get(fieldName));
                        	appFileinfo.setFilesource(Constant.FILESOURCE);
                        	appFileinfo.setMimetype(item.getContentType());
                        	appFileinfo.setCompressed("0");
                        	appFileinfo.setFilesize(Long.valueOf(item.getSize()));
                        	appFileinfo.setFiledate(DateUtil.getSystemDateTime());
                        	//用bussiness这一列，表示流程签字盖章图片所属用户以及对应的图片顺序
                        	appFileinfo.setBusinessid(business);
                        	String fileid = appFileinfo.getFileid();
	                        if(list.size() > 0){
	                        	flowDao.saveOrUpdate(appFileinfo);
	                        }else{
	                        	fileid = flowDao.insert(appFileinfo);
	                        }
	                        flowDao.saveFileToBlob(fileid, item.getInputStream(), (int)item.getSize(), list.isEmpty());
                    	}
                    }
                    catch(Exception ex)
                    {
                        msg = ex.getMessage();
                    }
                }
            }
        }
        catch(Exception ex)
        {
            info = (new StringBuilder("{success: false, msg: '上传失败！<br>失败原因：")).append(ex.getMessage()).append("'}").toString();
        }
        info = "{success: true, msg: '成功上传签名图片！'}";
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }

    private void downloadSign(HttpServletRequest request, HttpServletResponse response)
    {
        String userid = request.getParameter("userid");
        String order = request.getParameter("order");
        String signname = "用户签名图片";
        String msg = "";
        if(userid == null || userid == null)
            msg = "缺少参数！";
        else
            try
            {
            	InputStream is = null;
                if(order.equals("0")){
                	is = flowDao.getFileBlob(userid);
                }else{
                    List<AppFileinfo> list = flowDao.findByWhere(AppFileinfo.class.getName(), "businessid like '"+userid+"-"+order+"'");
                    if(list.size() > 0){
                    	AppFileinfo fileinfo = list.get(0);
                    	String fileid = fileinfo.getFileid();
                    	is = flowDao.getFileBlob(fileid);
                    	signname = "用户签字盖章图片";
                    }
                }
                if(is == null)
                {
                    msg = (new StringBuilder("文件缺失：")).append(userid).toString();
                } else
                {
                    String filename = (new String(signname.getBytes("GBK"), "ISO-8859-1")).concat(".jpg");
                    response.reset();
                    response.setContentType("application/vnd.ms-word");
                    response.setHeader("Content-disposition", (new StringBuilder("attachment; filename=")).append(filename).toString());
                    ServletOutputStream os = response.getOutputStream();
                    byte buf[] = new byte[8096];
                    for(int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
                        os.write(buf, 0, bytes);

                    os.flush();
                    os.close();
                    is.close();
                }
            }
            catch(Exception e)
            {
                e.printStackTrace();
                msg = e.getMessage();
            }
    }

    private void uploadAdjunct(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        int count;
        response.setContentType("text/html; charset=utf-8");
        info = "{success: true, msg: '附件上传成功！'}";
        count = 0;
        try
        {
            String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
            log.debug((new StringBuilder("file uploading begin at ")).append(DateUtil.getSystemDateTimeStr("yyyy-MM-dd HH:mm:ss")).append(". using temp folder: ").append(uploadTempFolder).toString());
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(4096);
            factory.setRepository(new java.io.File(uploadTempFolder));
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(0x3200000L);
            upload.setHeaderEncoding("utf-8");
            HashMap fieldMap = new HashMap();
            HashMap fileMap = new HashMap();
            List fileItems = upload.parseRequest(request);
            for(Iterator iter = fileItems.iterator(); iter.hasNext();)
            {
                FileItem item = (FileItem)iter.next();
                String fieldName = item.getFieldName();
                if(item.isFormField())
                {
                    if(fieldName != null && fieldName.indexOf("fileid") > -1 && fieldMap.get(fieldName) == null)
                        fieldMap.put(fieldName, item.getString());
                } else
                if(fieldMap.get(fieldName) == null)
                {
                    fieldMap.put(fieldName, item.getName().split("\\\\")[item.getName().split("\\\\").length - 1]);
                    fileMap.put(fieldName, item);
                }
            }

            for(Iterator itr = fieldMap.entrySet().iterator(); itr.hasNext();)
            {
                java.util.Map.Entry entry = (java.util.Map.Entry)itr.next();
                String key = ((String)entry.getKey()).toString();
                String value = (String)entry.getValue();
                if(value != null && !value.equals(""))
                {
                    FileItem item = (FileItem)fileMap.get(key);
                    String msg = "ok";
                    try
                    {
                        String insid = request.getParameter("insid");
                        FlwAdjunctIns flwAdjunctIns = new FlwAdjunctIns();
                        flwAdjunctIns.setFilename((String)fieldMap.get(item.getFieldName()));
                        flwAdjunctIns.setFilesize(Long.valueOf(item.getSize()));
                        flwAdjunctIns.setFiledate(DateUtil.getSystemDateTime());
                        flwAdjunctIns.setInsid(insid);
                        flwAdjunctIns.setIsmove("0");
                        baseDao.saveOrUpdate(flwAdjunctIns);
                        flowDao.saveFileToBlob(flwAdjunctIns.getFileid(), item.getInputStream(), (int)item.getSize(), true);
                        count++;
                    }
                    catch(Exception ex)
                    {
                        msg = ex.getMessage();
                    }
                }
            }
        }
        catch(Exception ex)
        {
            info = (new StringBuilder("{success: false, msg: '上传失败！<br>失败原因：")).append(ex.getMessage()).append("'}").toString();
        }
        info = (new StringBuilder("{success: true, msg: '成功上传（")).append(count).append("）附件！'}").toString();
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }

    private void loadAdjunct(HttpServletRequest request, HttpServletResponse response)
    {
        String fileid = request.getParameter("fileid");
        String msg = "";
        if(fileid == null)
        {
            msg = "缺少参数！";
        } else
        {
            FlwAdjunctIns file = (FlwAdjunctIns)baseDao.findByWhere2(adjunctInsBean, (new StringBuilder("fileid='")).append(fileid).append("'").toString()).get(0);
            if(file == null)
                msg = "文件不存在！";
            else
                try
                {
                    InputStream is = flowDao.getFileBlob(file.getFileid());
                    if(is == null)
                    {
                        msg = (new StringBuilder("文件缺失：")).append(file.getFileid()).toString();
                    } else
                    {
                        String filename = new String(file.getFilename().getBytes("GBK"), "ISO-8859-1");
                        response.reset();
                        response.setContentType("application/vnd.ms-word");
                        response.setHeader("Content-disposition", (new StringBuilder("attachment; filename=")).append(filename).toString());
                        ServletOutputStream os = response.getOutputStream();
                        byte buf[] = new byte[8096];
                        for(int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
                            os.write(buf, 0, bytes);

                        os.flush();
                        os.close();
                        is.close();
                    }
                }
                catch(Exception e)
                {
                    e.printStackTrace();
                    msg = e.getMessage();
                } finally {
                	if(msg!=null && msg.length()>0) {
    					response.reset();
    					msg = Constant.HTMLMETAHEADER.concat(msg);
    					try {
							outputString(response, msg);
						} catch (IOException e) {
							e.printStackTrace();
						}
    				}
                }
        }
    }

    private void loadFile(HttpServletRequest request, HttpServletResponse response)
    {
        String fileid = request.getParameter("fileid");
        String msg = "";
        if(fileid == null)
        {
            msg = "缺少参数！";
        } else
        {
            FlwFiles file = (FlwFiles)baseDao.findByWhere2(fileBean, (new StringBuilder("fileid='")).append(fileid).append("'").toString()).get(0);
            if(file == null)
                msg = "文件不存在！";
            else
                try
                {
                    InputStream is = flowDao.getFileBlob(file.getFileid());
                    if(is == null)
                    {
                        msg = (new StringBuilder("文件缺失：")).append(file.getFileid()).toString();
                    } else
                    {
                        String filename = new String(file.getFilename().getBytes("GBK"), "ISO-8859-1");
                        response.reset();
                        response.setContentType("application/vnd.ms-word");
                        response.setHeader("Content-disposition", (new StringBuilder("attachment; filename=")).append(filename).toString());
                        ServletOutputStream os = response.getOutputStream();
                        byte buf[] = new byte[8096];
                        for(int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
                            os.write(buf, 0, bytes);

                        os.flush();
                        os.close();
                        is.close();
                    }
                }
                catch(Exception e)
                {
                    e.printStackTrace();
                    msg = e.getMessage();
                } finally {
                	if(msg!=null && msg.length()>0) {
    					response.reset();
    					msg = Constant.HTMLMETAHEADER.concat(msg);
    					try {
							outputString(response, msg);
						} catch (IOException e) {
							e.printStackTrace();
						}
    				}
                }
        }
    }

    private void deleteAdjunct(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        String fileid;
        response.setContentType("text/html; charset=utf-8");
        info = "成功删除流程附件！";
        fileid = request.getParameter("fileid");
        try
        {
            FlwAdjunctIns adjFileIns = (FlwAdjunctIns)baseDao.findById(adjunctInsBean, fileid);
            baseDao.delete(adjFileIns);
            flowDao.deleteFileInBlob(fileid);
        }
        catch(RuntimeException e)
        {
            info = (new StringBuilder("错误原因：")).append(e.getMessage()).toString();
            e.printStackTrace();
        }
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }

    public void extUpload(HttpServletRequest request, HttpServletResponse response)
        throws IOException
    {
        String info;
        StringBuffer fileInfo;
        int count;
        response.setContentType("text/html; charset=utf-8");
        info = "{success: true, msg: '附件上传成功！'}";
        fileInfo = new StringBuffer("");
        count = 0;
        try
        {
            String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(4096);
            factory.setRepository(new java.io.File(uploadTempFolder));
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(0x3200000L);
            upload.setHeaderEncoding("utf-8");
            HashMap fieldMap = new HashMap();
            HashMap fileMap = new HashMap();
            List fileItems = upload.parseRequest(request);
            for(Iterator iter = fileItems.iterator(); iter.hasNext();)
            {
                FileItem item = (FileItem)iter.next();
                String fieldName = item.getFieldName();
                if(item.isFormField())
                {
                    if(fieldName != null && fieldName.indexOf("fileid") > -1 && fieldMap.get(fieldName) == null)
                        fieldMap.put(fieldName, item.getString());
                } else
                if(fieldMap.get(fieldName) == null)
                {
                    fieldMap.put(fieldName, item.getName().split("\\\\")[item.getName().split("\\\\").length - 1]);
                    fileMap.put(fieldName, item);
                }
            }

            for(Iterator itr = fieldMap.entrySet().iterator(); itr.hasNext();)
            {
                java.util.Map.Entry entry = (java.util.Map.Entry)itr.next();
                String fileid = ((String)entry.getKey()).toString();
                String filename = (String)entry.getValue();
                if(filename != null && !filename.equals(""))
                {
                    FileItem item = (FileItem)fileMap.get(fileid);
                    String msg = "ok";
                    try
                    {
                        fileid = appMgm.updateFile(fileid.equals("-1") ? null : fileid, item);
                        fileInfo.append((new StringBuilder(String.valueOf(fileid))).append(":").append(filename).toString());
                        if(itr.hasNext())
                            fileInfo.append(",");
                        count++;
                    }
                    catch(Exception ex)
                    {
                        msg = ex.getMessage();
                    }
                }
            }
        }
        catch(Exception ex)
        {
            info = (new StringBuilder("{success: false, msg: '上传失败！<br>失败原因：")).append(ex.getMessage()).append("'}").toString();
        }
        info = (new StringBuilder("{success: true, msg: '成功上传（")).append(count).append("）附件！', fileinfo: '").append(fileInfo.toString()).append("'}").toString();
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.write(info);
        out.flush();
    }
    /**
     * 下载定义的流程，在servlet中需要传递flowids参数，flowids是流程定义ID串，使用(，)分隔，如：flowids=333asdf23333,3464sdfas8989
     * @param request
     * @param response
     */
    public void exportFlwDefinitions(HttpServletRequest request, HttpServletResponse response){
    	ZipOutputStream zout = null;
    	try{
    		Map<String,String> flwFrameMap = new HashMap<String,String>();
    		
    		String flowidsStr = request.getParameter("flowids")==null?"":request.getParameter("flowids");
    		String[] flowids = flowidsStr.split(",");
	    	if(flowids.length>0){
	    		response.setHeader("Content-disposition", (new StringBuilder("attachment; filename=")).append("flwDefinition.zip").toString());
	    		zout = new ZipOutputStream(response.getOutputStream());
	    		zout.setEncoding("gbk");
	    		
	    		String path = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
	    		
	    		for(String flowid : flowids){
	    			if(!flowid.equals("")){
	    				String folder = flowid.concat("\\");

	    				FlwDefinitionView flwDef = (FlwDefinitionView)baseDao.findById(defBean, flowid);
	    				if(flwDef!=null){
	    					ZipEntry zeFlwDef = new ZipEntry(folder.concat("data.txt"));
	    					zout.putNextEntry(zeFlwDef);//流程定义记录
	    					zout.write((defBean+"="+JSONObject.fromObject(flwDef).toString()+"\r\n").getBytes());
	    					//状态节点部分
	    					List lt1 = baseDao.findByWhere(nodeBean, "flowid='"+flowid+"'");
	    					for(int i=0;i<lt1.size();i++){
	    						zout.write((nodeBean+"="+JSONObject.fromObject(lt1.get(i)).toString()+"\r\n").getBytes());
	    					}
	    					//状态节点流传部分
	    					List lt2 = baseDao.findByWhere(pathViewBean, "flowid='"+flowid+"'");
	    					for(int i=0;i<lt2.size();i++){
	    						zout.write((pathViewBean+"="+JSONObject.fromObject(lt2.get(i)).toString()+"\r\n").getBytes());
	    					}
	    					//普通节点部分
	    					List lt3 = baseDao.findByWhere(cnodeBean, "flowid='"+flowid+"'");
	    					for(int i=0;i<lt3.size();i++){
	    						zout.write((cnodeBean+"="+JSONObject.fromObject(lt3.get(i)).toString()+"\r\n").getBytes());
	    					}
	    					//普通节点流传部分
	    					List lt4 = baseDao.findByWhere(cpathBean, "flowid='"+flowid+"'");
	    					for(int i=0;i<lt4.size();i++){
	    						zout.write((cpathBean+"="+JSONObject.fromObject(lt4.get(i)).toString()+"\r\n").getBytes());
	    					}
	    					//状态节点处文件模块部分
	    					List lt5 = baseDao.findByWhere(fileBean, "flowid='"+flowid+"'");
	    					for(int i=0;i<lt5.size();i++){
	    						zout.write((fileBean+"="+JSONObject.fromObject(lt5.get(i)).toString()+"\r\n").getBytes());
	    					}
	    					//状态节点处的文档大对象
	    					for(int i=0;i<lt5.size();i++){
	    						try{
	    							FlwFiles flwfile = (FlwFiles) lt5.get(0);
	    							InputStream in = baseDao.getBlobInputStream(flwfile.getFileid(), "0");
	    							
	    							ZipEntry blob = new ZipEntry(folder+flwfile.getFileid().concat(".doc"));
		    						zout.putNextEntry(blob);
	    							
	    							byte[] buf = new byte[2048];
	    							int len;
	    							while ((len = in.read(buf, 0, 2048)) != -1) {
	    								zout.write(buf, 0, len);
	    							}
	    							in.close();
	    							zout.closeEntry();
	    						}catch(Exception ex){
	    							ex.printStackTrace();
	    						}
	    					}
	    					//状态节点XML文件
	    					if(flwDef.getXmlname()!=null&&!(flwDef.getXmlname().equals(""))){
	    						String nodeXml = flwDef.getXmlname().concat(".xml");
	    						java.io.File xmlNodeFile = new java.io.File(path.concat(nodeXml));
	    						if(xmlNodeFile.exists()){
	    							InputStream in = new FileInputStream(xmlNodeFile);
	    							
	    							ZipEntry xmlfile = new ZipEntry(folder+nodeXml);
		    						zout.putNextEntry(xmlfile);

		    						byte[] buf = new byte[2048];
	    							int len;
	    							while ((len = in.read(buf, 0, 2048)) != -1) {
	    								zout.write(buf, 0, len);
	    							}
	    							in.close();
	    							zout.closeEntry();
	    						}
	    					}
	    					//普通节点XML文件
	    					List lt6 = baseDao.findByWhere(nodeBean, "flowid='"+flowid+"' and xmlname is not null");
	    					for(int i=0;i<lt6.size();i++){
	    						FlwNodeView tmp = (FlwNodeView)lt6.get(i);
	    						String nodeXml = tmp.getXmlname().concat(".xml");
	    						java.io.File xmlNodeFile = new java.io.File(path.concat(nodeXml));
	    						if(xmlNodeFile.exists()){
	    							InputStream in = new FileInputStream(xmlNodeFile);
	    							
	    							ZipEntry xmlfile = new ZipEntry(folder+nodeXml);
		    						zout.putNextEntry(xmlfile);

		    						byte[] buf = new byte[2048];
	    							int len;
	    							while ((len = in.read(buf, 0, 2048)) != -1) {
	    								zout.write(buf, 0, len);
	    							}
	    							in.close();
	    							zout.closeEntry();
	    						}
	    					}
	    					
	    				}
	    			}
	    		}
	    		zout.close();
	    	}	
    	}catch(Exception ex){
    		ex.printStackTrace();
    		try {
				response.getOutputStream().close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    }
    /**
     * 导入流程
     * @param request
     * @param response
     */
    public void importFlwDefinitions(HttpServletRequest request, HttpServletResponse response){
			String path = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
			java.io.File f2 = new java.io.File(path);
			if(!f2.exists()) f2.mkdirs();
			
			DiskFileItemFactory factory = new DiskFileItemFactory();
			// 缓冲区大小
			factory.setSizeThreshold(10*2014);
			factory.setRepository(new java.io.File(path));
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			// 设置文件大小的上限
			upload.setSizeMax(Constant.MAXFILESIZE);
			// 编码
			upload.setHeaderEncoding(Constant.ENCODING);
			
			try {
				LocalSessionFactoryBean  localSessionFactoryBean = (LocalSessionFactoryBean)this.wac.getBean("&sessionFactory1");
				Configuration hc = localSessionFactoryBean.getConfiguration();
				
				List<FileItem> fileItems = upload.parseRequest(request);
				Iterator iter = fileItems.iterator();
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					if (!item.isFormField() && item.getSize()>0 ) {
						
						java.util.zip.ZipInputStream zin = new java.util.zip.ZipInputStream(item.getInputStream());
						java.util.zip.ZipEntry ze = null;
						
						while((ze=zin.getNextEntry())!=null){
							if(!ze.isDirectory()){
								String pname = ze.getName();
								String[] arr = pname.split("\\\\");
								if(arr.length!=2) arr = pname.split("//");
								String filename = arr[1];
								if(filename.endsWith(".xml")){
									java.io.File xmlfile = new java.io.File(path.concat(filename));
									FileOutputStream fos = new FileOutputStream(xmlfile);
									int len;
									byte[] buf = new byte[2048];
									while ((len = zin.read(buf, 0, 2048)) != -1) {
										fos.write(buf, 0, len);
									}
									fos.close();
								}else if(pname.endsWith(".doc")){
									String fileid = filename.substring(0,filename.length()-4);
									boolean isNew = flowDao.getDataAutoCloseSes("select fileid from app_blob where fileid='"+fileid+"'").size()==0?true:false;
									
									java.io.File docfile = new java.io.File(path.concat(filename));
									FileOutputStream fos = new FileOutputStream(docfile);
									int len;
									byte[] buf = new byte[2048];
									while ((len = zin.read(buf, 0, 2048)) != -1) {
										fos.write(buf, 0, len);
									}
									fos.close();
									InputStream in = new FileInputStream(docfile);
									flowDao.saveFileToBlob(fileid, in, (new Long(ze.getSize())).intValue(), isNew);
									docfile.delete();
								}else{
									BufferedReader bread = new BufferedReader(new InputStreamReader(zin));
									String s;
									while((s=bread.readLine())!=null){
										if(s!=null&&!(s.equals(""))){
											String[] array = s.split("=");
											String beanName = array[0];
											String jsonString = array[1];
											Class<?> clazz = Class.forName(beanName);
											
											Object object = JSONObject.toBean(JSONObject.fromObject(jsonString), clazz);
											
											PersistentClass pc = hc.getClassMapping(beanName);
											Property idp = pc.getIdentifierProperty();
											Column idc = (Column)idp.getColumnIterator().next();
											String id  = idp.getName();
											
											Method getMethod = clazz.getDeclaredMethod("get"+id.substring(0, 1).toUpperCase()+id.substring(1));
											String val = (String) getMethod.invoke(object);
											if(flowDao.findById(beanName, val)==null){
												StringBuffer sbf1 = new StringBuffer("insert into "+pc.getTable().getName()+" ("+id);
												StringBuffer sbf2 = new StringBuffer(" VALUES ('"+val+"'");
												Iterator itor = pc.getPropertyIterator();
												while(itor.hasNext()){
													Property pro = (Property)itor.next();
													if (!pro.isComposite()) {
														Iterator it = pro.getColumnIterator();
														Column col = (Column)it.next();
														String javatype = col.getValue().getType().getReturnedClass().getName();
														String field = pro.getName();
														String colName = col.getName();
														sbf1.append(","+colName);
														
														Object val1 = clazz.getDeclaredMethod("get"+field.substring(0, 1).toUpperCase()
																	+field.substring(1)).invoke(object);
														
														if(javatype.endsWith("Date")){
															sbf2.append(",sysdate");
														}else{
															sbf2.append(",'"+val1.toString()+"'");
														}
													}
												}
												
												String sql = sbf1.append(")").append(sbf2).append(")").toString();
												System.out.println("SQL:"+sql);
												(new JdbcTemplate(Constant.DATASOURCE)).execute(sql);
											}else{
												flowDao.saveOrUpdate(object);
											}
										}
									}
								}
								zin.closeEntry();
							}
						}
						zin.close();
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
    }
    
    private static final long serialVersionUID = 1L;
    private WebApplicationContext wac;
    private BaseMgmFacade baseMgm;
    private FlwFrameMgmFacade flwFrameMgm;
    private ApplicationMgmFacade appMgm;
    private BaseDAO baseDao;
    private FlowDAO flowDao;
    private static final Log log = LogFactory.getLog(FlwServlet.class);
    private ServletConfig servletConfig;
    private String fileInsBean;
    private String adjunctInsBean;
    private String frameBean;
    private String defBean;
    private String nodeBean;
    private String pathViewBean;
    private String cnodeBean;
    private String cpathBean;
    private String fileBean;
    
}
