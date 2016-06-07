package com.sgepit.frame.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import oracle.xml.sql.query.OracleXMLQuery;

import org.jdom.CDATA;
import org.jdom.Comment;
import org.jdom.DocType;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.EntityRef;
import org.jdom.JDOMException;
import org.jdom.ProcessingInstruction;
import org.jdom.Text;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import com.sgepit.frame.base.env.HibernateSessionFactory;

public class XMLUtil {
	
	public static Document getRequestDocument(HttpServletRequest request) {
		return buildFromXMLString(getRequestData(request));
	}

	public static String getRequestData(HttpServletRequest request) {
		String xmlStr = "";
		try {
			request.setCharacterEncoding(ENCODING);
			ServletInputStream stream = request.getInputStream();
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];
			int bytesRead = 0;
			while ((bytesRead = stream.read(buffer, 0, 1024)) != -1) {
				baos.write(buffer, 0, bytesRead);
			}
			byte[] b = baos.toByteArray();
			xmlStr = new String(b);
		} catch (IOException ex) {
			ex.printStackTrace();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return xmlStr;
	}

	public static Document buildFromXMLString(String xmlString) {
		try {
			SAXBuilder builder = new SAXBuilder();
			Document anotherDocument = builder
					.build(new StringReader(xmlString));
			return anotherDocument;
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (NullPointerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void sendXmlBack(Document xmlBack,
			HttpServletResponse response) {
		try {
			response.setContentType(CONTENT_TYPE);
			javax.servlet.ServletOutputStream out = response.getOutputStream();
			Format ft = Format.getRawFormat();
			ft.setEncoding(ENCODING);
			XMLOutputter xmlOut = new XMLOutputter(ft);
			xmlOut.output(xmlBack, out);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static String getXMLString(Object obj) {
		String xml = "";
		Format format = Format.getRawFormat();
		format.setEncoding(ENCODING);
		XMLOutputter xmlOut = new XMLOutputter(format);
		if (obj instanceof Document) {
			xml = xmlOut.outputString((Document) obj);
		} else if (obj instanceof Element) {
			xml = xmlOut.outputString((Element) obj);
		} else if (obj instanceof CDATA) {
			xml = xmlOut.outputString((CDATA) obj);
		} else if (obj instanceof DocType) {
			xml = xmlOut.outputString((DocType) obj);
		} else if (obj instanceof Comment) {
			xml = xmlOut.outputString((Comment) obj);
		} else if (obj instanceof Text) {
			xml = xmlOut.outputString((Text) obj);
		} else if (obj instanceof EntityRef) {
			xml = xmlOut.outputString((EntityRef) obj);
		} else if (obj instanceof ProcessingInstruction) {
			xml = xmlOut.outputString((ProcessingInstruction) obj);
		}
		return xml;
	}

	public static String getRowDataXML(String sql) {
		String dataXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><ROWSET></ROWSET>";
		Connection con = null;
		try {
			con = HibernateSessionFactory.getConnection();
			ResultSet rs = null;
			rs = con.createStatement().executeQuery(sql);
			OracleXMLQuery oxq = new OracleXMLQuery(con, rs);
			dataXML = oxq.getXMLString();
			oxq.close();
			rs.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (con != null) {
				try {
					con.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return dataXML;
	}

	private static String CONTENT_TYPE = "text/xml";

	private static String ENCODING = "UTF-8";

}
