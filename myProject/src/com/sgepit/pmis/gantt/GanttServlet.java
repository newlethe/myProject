package com.sgepit.pmis.gantt;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.sgepit.frame.base.Constant;


public class GanttServlet extends HttpServlet {

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String fname=null;
		request.setCharacterEncoding("GBK");
		
		//检查是否有文件上传的请求
		boolean isUpload = ServletFileUpload.isMultipartContent(request);

		//创建一个基于磁盘文件项的工厂
		DiskFileItemFactory factory = new DiskFileItemFactory();

		//设置工厂约束:
		//1.设置文件存放的路径
		String osPath = Constant.AppRootDir.concat("gantt/uploadXmlData/");
		System.out.println("装入xml文件"+osPath);
		File path = new File(osPath);
		factory.setRepository(path);
		//2.设置最大内存大小
		factory.setSizeThreshold(1024);

		//创建一个新的文件上传处理对象
		ServletFileUpload upload = new ServletFileUpload(factory);
		//设置最大上传文件大小
		upload.setFileSizeMax(1024 * 1024*1000);
        String name="";
		try {
			//解析请求
			List items = upload.parseRequest(request);
			Iterator ite = items.iterator();
			while (ite.hasNext()) {
				//集合中的每一个元素是FileItem对象
				FileItem item = (FileItem) ite.next();
				if (item.isFormField()) {//一般表单字段
				} else {//文件
					System.out.println("文件名:" + item.getName());
					System.out.println("文件大小:" + item.getSize());
					//保存文件到指定目录
					String filename=item.getName();
					name=filename;
					File tempFile = new File(item.getName());
					fname=filename.substring(filename.lastIndexOf("\\")+1);
					
					File target = new File(factory.getRepository(),fname);
				    item.write(target);
				    filename=item.getName();//获得上传文件的原始地址和文件名
				}
			}
			
			
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		//name=name.substring(name.lastIndexOf(File.separator)+1);
		name=name.substring(name.lastIndexOf("\\")+1);
		request.setAttribute("re_xml", "gantt/uploadXmlData/"+name);
		request.setAttribute("allPath", osPath);
		request.getRequestDispatcher("/gantt/xmlfile.jsp").forward(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

}
