package com.dhtmlx.xml2excel;


import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.*;

import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;

import com.dhtmlx.xml2excel.ExcelWriter;


//@SuppressWarnings("serial")
//@Controller
//@RequestMapping(value="/servlet/dhtmlx2excel")
public class ExcelGenerator extends HttpServlet {
//	@RequestMapping(method = RequestMethod.POST)
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String xml = req.getParameter("grid_xml");
		String fileName = req.getParameter("fileName");		
		xml = URLDecoder.decode(xml, "UTF-8");
		if((fileName!=null)&&(!fileName.equals(""))){
			fileName = URLEncoder.encode(fileName, "UTF-8");
			(new ExcelWriter()).generateWithName(xml,fileName,resp);//导出指定文件名的excel文件
		}else{
			(new ExcelWriter()).generate(xml, resp);
		}
	}

	
}