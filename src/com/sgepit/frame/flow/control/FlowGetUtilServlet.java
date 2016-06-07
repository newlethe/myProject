// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   FlowGetUtilServlet.java

package com.sgepit.frame.flow.control;

import com.sgepit.frame.util.ConnectionMan;
import com.sgepit.frame.util.MD5Util;
import com.sgepit.frame.util.UtilTool;
import java.awt.Font;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
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

// Referenced classes of package com.hdkj.flow.servlet:
//			MD5Encrypt

public class FlowGetUtilServlet extends HttpServlet
{

	private static final Logger logger;
	private static final long serialVersionUID = 1L;
	private static final String CONTENT_TYPE = "text/xml";
	private Connection con;
	private Statement stmt;
	private ResultSet rs;
	private static final Font font = new Font("新宋体", 0, 12);

	public FlowGetUtilServlet()
	{
		con = null;
		stmt = null;
		rs = null;
	}

	public void init()
		throws ServletException
	{
		super.init();
	}

	public void destroy()
	{
		super.destroy();
	}

	private void getConnection()
	{
		try
		{
			con = ConnectionMan.getConnection();
			stmt = con.createStatement(1004, 1008);
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
	}

	private void destroyConnection()
	{
		try
		{
			if (stmt != null)
				stmt.close();
			if (con != null)
				con.close();
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
	}

	private String loadRequest(HttpServletRequest request, HttpServletResponse response)
	{
		String xmlStr = "";
		try
		{
			request.setCharacterEncoding("GB2312");
			ServletInputStream stream = request.getInputStream();
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte buffer[] = new byte[1024];
			for (int bytesRead = 0; (bytesRead = stream.read(buffer, 0, 1024)) != -1;)
				baos.write(buffer, 0, bytesRead);

			byte b[] = baos.toByteArray();
			xmlStr = new String(b);
			Document xmlDoc = buildFromXMLString(xmlStr);
			Element rootEl = xmlDoc.getRootElement();
			xmlStr = rootEl.getText();
		}
		catch (IOException ex)
		{
			ex.printStackTrace();
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		return xmlStr;
	}

	private Document loadRequest1(HttpServletRequest request, HttpServletResponse response)
	{
		String xmlStr = "";
		Document xmlDoc = null;
		try
		{
			request.setCharacterEncoding("GB2312");
			ServletInputStream stream = request.getInputStream();
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte buffer[] = new byte[1024];
			for (int bytesRead = 0; (bytesRead = stream.read(buffer, 0, 1024)) != -1;)
				baos.write(buffer, 0, bytesRead);

			byte b[] = baos.toByteArray();
			xmlStr = new String(b);
			xmlDoc = buildFromXMLString(xmlStr);
			return xmlDoc;
		}
		catch (IOException ex)
		{
			ex.printStackTrace();
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		return xmlDoc;
	}

	public synchronized void doGet(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException
	{
		long start = System.currentTimeMillis();
		getConnection();
		String method = request.getParameter("mode");
		if (method.equalsIgnoreCase("browseFujian"))
		{
			ServletOutputStream os = response.getOutputStream();
			String param = request.getParameter("param");
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String file_lsh = arr[2];
			String sql = "";
			sql = "select flow_log_file.file_name,system_longdata.file_nr from flow_log_file,system_longdata where system_longdata.file_lsh = flow_log_file.file_lsh and flow_log_file.flow_code = '" + flow_code + "' and flow_log_file.id = '" + flow_id + "' and flow_log_file.file_lsh = '" + file_lsh + "'";
			try
			{
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					String fileName = rs.getString("file_name");
					InputStream in = rs.getBinaryStream("file_nr");
					if (in != null)
					{
						if (request.getHeader("User-Agent").indexOf("MSIE 5.5") != -1)
							response.setHeader("Content-Disposition", "filename=" + new String(fileName.getBytes("GB2312"), "ISO8859_1"));
						else
							response.addHeader("Content-disposition", "attachment; filename=" + new String(fileName.getBytes("GB2312"), "ISO8859_1"));
						byte buf[] = new byte[1024];
						int len;
						while ((len = in.read(buf, 0, 1024)) != -1) 
							os.write(buf, 0, len);
						response.setStatus(200);
						response.flushBuffer();
					} else
					{
						response.setContentType("text/html; charset=GB2312");
						os.println("打开文件: " + fileName + "时发生错误！请重新上传！");
					}
					os.close();
					in.close();
					rs.close();
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		} else
		if (method.equalsIgnoreCase("showlct"))
		{
			String param = request.getParameter("param");
			String arr[] = param.split("`");
			String flowcode = arr[0];
			String flowid = arr[1];
			PrintWriter pw = response.getWriter();
			String str = "<html><head><title>注：红色边框的步骤是正在处理的步骤!  --</title></head><body><br><img src='FlowGetUtilServlet?mode=flowgraphpic&param=" + flowcode + "`" + flowid + "' /></body></html>";
			String content = new String(str.getBytes("GB2312"), "ISO8859_1");
			pw.write(content);
			pw.close();
		} else
		if (method.equalsIgnoreCase("flowgraphpic"))
		{
			String param = request.getParameter("param");
			String arr[] = param.split("`");
			String flowcode = arr[0];
			String flowid = arr[1];
			java.util.List list = (java.util.List)getFlowConfigCellsObj(flowcode);
			java.util.List nodelist = (java.util.List)list.get(0);
			java.util.List transitionlist = (java.util.List)list.get(1);
			java.util.List tasklist = (java.util.List)getFlowTaskCellsObj(flowid);
		} else
		if (method.equalsIgnoreCase("getflowconfig"))
		{
			String param = request.getParameter("param");
			String flowcode = param;
			java.util.List list = (java.util.List)getFlowConfigCellsObj(flowcode);
			ObjectOutputStream oos = new ObjectOutputStream(response.getOutputStream());
			oos.writeObject(list);
		}
		destroyConnection();
	}

	public synchronized void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException
	{
		long start = System.currentTimeMillis();
		getConnection();
		String rtn = "";
		String method = request.getParameter("mode").toString();
		if (method.equalsIgnoreCase("getUniqueID"))
		{
			String sql = "";
			sql = "select substr(to_char(systimestamp,'yyyymmddhh24missff'),0,17) uniqueid from dual";
			try
			{
				rs = stmt.executeQuery(sql);
				rtn = "";
				if (rs.next())
					rtn = rs.getString("uniqueid");
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getHandlePage"))
		{
			String param = loadRequest(request, response);
			String flow_code = param;
			String fun_code = "";
			rtn = "";
			if (flow_code != null && !flow_code.equalsIgnoreCase("") && stmt != null)
				try
				{
					String sql = "select fun_code from flow_master where flow_code = '" + flow_code + "'";
					rs = stmt.executeQuery(sql);
					if (rs.next())
						fun_code = rs.getString("fun_code");
					sql = "select winname from fun_list where code = '" + fun_code + "'";
					rs = stmt.executeQuery(sql);
					if (rs.next())
						rtn = rs.getString("winname");
					if (rtn.lastIndexOf(".") != -1)
						rtn = rtn.substring(0, rtn.lastIndexOf(".")) + "_flow" + rtn.substring(rtn.lastIndexOf("."));
				}
				catch (SQLException e)
				{
					e.printStackTrace();
				}
		}
		if (method.equalsIgnoreCase("getFlowList"))
		{
			String param = loadRequest(request, response);
			rtn = "";
			String fun_code = "";
			String bill_id = "";
			if (param.split("`").length == 1)
			{
				fun_code = param.split("`")[0];
			} else
			{
				fun_code = param.split("`")[0];
				bill_id = param.split("`")[1];
			}
			if (fun_code != null && !fun_code.equalsIgnoreCase(""))
				if (bill_id.equalsIgnoreCase(""))
				{
					String sql = "select flow_code, flow_name from flow_master where fun_code = '" + fun_code + "' and is_template = 1";
					if (stmt != null)
						try
						{
							for (rs = stmt.executeQuery(sql); rs.next();)
								if (rtn.equalsIgnoreCase(""))
									rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("flow_name");
								else
									rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("flow_name");

						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}
				} else
				{
					String sql = "select flowcodes from gcjs_bill_flow where fun_code = '" + fun_code + "' and type_code = '" + bill_id + "' order by pid desc";
					if (stmt != null)
						try
						{
							rs = stmt.executeQuery(sql);
							String flows = "";
							if (rs.next())
								flows = rs.getString("flowcodes");
							if (flows != null && !flows.equalsIgnoreCase(""))
							{
								sql = "select flow_code, flow_name from flow_master where '" + flows + "' like '%'||flow_code||'`%' and flow_code <> '0'";
								for (rs = stmt.executeQuery(sql); rs.next();)
									if (rtn.equalsIgnoreCase(""))
										rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("flow_name");
									else
										rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("flow_name");

							} else
							{
								sql = "select flow_code, flow_name from flow_master where fun_code = '" + fun_code + "' and is_template = 1";
								if (stmt != null)
									try
									{
										for (rs = stmt.executeQuery(sql); rs.next();)
											if (rtn.equalsIgnoreCase(""))
												rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("flow_name");
											else
												rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("flow_name");

									}
									catch (SQLException e)
									{
										e.printStackTrace();
									}
							}
						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}
				}
		}
		if (method.equalsIgnoreCase("listStartAvilibleSteps"))
		{
			String sql = "";
			String param = loadRequest(request, response);
			String flow_code = param;
			String startstep = "";
			rtn = "";
			if (flow_code != null && !flow_code.equalsIgnoreCase("") && stmt != null)
				try
				{
					sql = "select step_code from flow_step where flow_code = '" + flow_code + "' and setp_type = 0";
					rs = stmt.executeQuery(sql);
					if (rs.next())
						startstep = rs.getString("step_code");
					sql = "select flow_step_duc.flow_split_type, flow_activity.source_setp, flow_activity.end_setp, flow_step.step_name,flow_step.operator_type, flow_step.setp_type from flow_step, flow_activity, flow_step flow_step_duc where flow_step.flow_code = flow_activity.flow_code and flow_step_duc.flow_code = flow_activity.flow_code and flow_activity.end_setp = flow_step.step_code and flow_activity.source_setp = flow_step_duc.step_code  and flow_activity.source_setp = " + startstep + " and flow_activity.flow_code = '" + flow_code + "'";
					rs = stmt.executeQuery(sql);
					rtn = "";
					while (rs.next()) 
						if (rtn.equalsIgnoreCase(""))
							rtn = rtn + rs.getString("flow_split_type") + "`" + rs.getString("end_setp") + "`" + rs.getString("step_name") + "`" + rs.getString("operator_type") + "`" + rs.getString("setp_type");
						else
							rtn = rtn + "^" + rs.getString("flow_split_type") + "`" + rs.getString("end_setp") + "`" + rs.getString("step_name") + "`" + rs.getString("operator_type") + "`" + rs.getString("setp_type");
				}
				catch (SQLException e)
				{
					e.printStackTrace();
				}
		}
		if (method.equalsIgnoreCase("getSignature"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split(",");
			String flow_code = arr[0];
			String step_code = arr[1];
			String sql = "";
			if (flow_code != null && flow_code != "" && step_code != null && step_code != "")
			{
				sql = "select flow_signature.flow_code flow_code, flow_signature.step_code step_code, flow_signature.sign_level sign_level, flow_signature.groupid groupid, '级别：' || flow_signature.sign_level || '、' || group_notes_view_gwbp.notes_groupid notes, user_list.code userid, user_list.username username  from flow_signature, user_list, group_user, group_notes_view_gwbp where substr(group_user.groupid,1,length(flow_signature.groupid)) = flow_signature.groupid and flow_signature.groupid = group_notes_view_gwbp.groupid and group_user.userid = user_list.code (+)  and flow_signature.flow_code = '" + flow_code + "'" + " and flow_signature.step_code = " + step_code + " order by flow_signature.sign_level ";
				System.out.println(sql);
				if (stmt != null)
				{
					try
					{
						rs = stmt.executeQuery(sql);
						rtn = "";
						while (rs.next()) 
							if (rtn.equalsIgnoreCase(""))
								rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("step_code") + "`" + rs.getString("sign_level") + "`" + rs.getString("groupid") + "`" + rs.getString("notes") + "`" + (rs.getString("userid") != null ? rs.getString("userid") : "") + "`" + (rs.getString("username") != null ? rs.getString("username") : "");
							else
								rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("step_code") + "`" + rs.getString("sign_level") + "`" + rs.getString("groupid") + "`" + rs.getString("notes") + "`" + (rs.getString("userid") != null ? rs.getString("userid") : "") + "`" + (rs.getString("username") != null ? rs.getString("username") : "");
					}
					catch (SQLException e)
					{
						e.printStackTrace();
					}
					if (rtn.equalsIgnoreCase(""))
					{
						sql = "select t1.flow_code flow_code,t1.step_code step_code,t1.sign_level sign_level,t1.groupid groupid,t1.notes||'（'||t2.notes||'）' notes,'' userid,'' username from (select flow_signature.flow_code flow_code, flow_signature.step_code step_code,flow_signature.sign_level sign_level,flow_signature.groupid groupid,'级别：' || flow_signature.sign_level || '、' || (select notes from group_list where length(groupid) = 1) notes  from flow_signature where flow_signature.flow_code = '" + flow_code + "' and flow_signature.step_code = " + step_code + " ) t1 ,group_list t2 " + "where t1.groupid = t2.groupid " + "order by sign_level";
						try
						{
							rs = stmt.executeQuery(sql);
							rtn = "";
							while (rs.next()) 
								if (rtn.equalsIgnoreCase(""))
									rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("step_code") + "`" + rs.getString("sign_level") + "`" + rs.getString("groupid") + "`" + rs.getString("notes") + "`" + (rs.getString("userid") != null ? rs.getString("userid") : "") + "`" + (rs.getString("username") != null ? rs.getString("username") : "");
								else
									rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("step_code") + "`" + rs.getString("sign_level") + "`" + rs.getString("groupid") + "`" + rs.getString("notes") + "`" + (rs.getString("userid") != null ? rs.getString("userid") : "") + "`" + (rs.getString("username") != null ? rs.getString("username") : "");
						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}
					}
				}
			}
		}
		if (method.equalsIgnoreCase("saveStartFlow"))
		{
			String senduser = "";
			String touser = "";
			String subject = "";
			String sendtime = "";
			String param = loadRequest(request, response);
			String arr[] = param.split("~");
			String sql = "";
			if (arr[0].length() > 0)
			{
				String el[] = arr[0].concat(" ").split("`");
				String retrieve_condition = el[3].replaceAll("\\'", "''");
				sql = "insert into flow_log_master(flow_code,id,flow_state,retrieve_condition,userid,create_date,subject) values('" + el[0] + "','" + el[1] + "'," + el[2] + ",'" + retrieve_condition + "','" + el[4] + "',to_date('" + el[5] + "','yyyy-mm-dd hh24:mi:ss'), '" + el[6].trim() + "')";
				try
				{
					stmt.executeUpdate(sql);
				}
				catch (SQLException e)
				{
					e.printStackTrace();
				}
				senduser = el[4];
				sendtime = el[5];
				subject = el[6].trim();
			}
			if (arr[1].length() > 0)
			{
				String el[] = arr[1].split("\\^");
				int maxflow_step = 1;
				try
				{
					String elem[] = el[0].split("`");
					sql = "select max(flow_step) flow_step from flow_log_detail where flow_code = '" + elem[0] + "' and id = '" + elem[1] + "'";
					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						maxflow_step = rs.getInt("flow_step");
						maxflow_step++;
					}
				}
				catch (SQLException e)
				{
					e.printStackTrace();
				}
				for (int i = 0; i < el.length; i++)
					if (el[i].length() > 0)
						try
						{
							String elem[] = el[i].split("`");
							sql = "insert into flow_log_detail(flow_code,id,flow_step,setp_code,reading,sending,sending_object,groupid,from_step) values('" + elem[0] + "','" + elem[1] + "'," + maxflow_step + "," + elem[3] + "," + elem[4] + "," + elem[5] + ",'" + elem[6] + "','" + elem[7] + "'," + elem[2] + ")";
							stmt.executeUpdate(sql);
							touser = elem[6];
						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}

				for (int i = 0; i < el.length; i++)
					if (el[i].length() > 0)
					{
						String elem[] = el[i].split("`");
						String flow_code = elem[0];
						String flow_id = elem[1];
						String step_code = elem[3];
						sql = "select setp_type from flow_step where flow_code = '" + flow_code + "' and step_code = " + step_code;
						try
						{
							rs = stmt.executeQuery(sql);
							if (rs.next())
							{
								String setp_type = rs.getString("setp_type");
								if (setp_type.equalsIgnoreCase("-1"))
								{
									sql = "update flow_log_master set flow_state = 1 where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
									try
									{
										stmt.executeUpdate(sql);
										CallableStatement cstmt = null;
										cstmt = con.prepareCall("{? = call pkg_flow.updateParentTab(?,?,?) }");
										cstmt.registerOutParameter(1, 4);
										cstmt.setString(2, flow_code);
										cstmt.setString(3, flow_id);
										cstmt.setString(4, "0");
										cstmt.execute();
										int b = cstmt.getInt(1);
										if (b != 1)
											rtn = "FAILURE";
										else
											rtn = "OK";
										cstmt.close();
									}
									catch (SQLException e)
									{
										e.printStackTrace();
										rtn = "FAILURE";
									}
								}
							}
						}
						catch (SQLException e)
						{
							e.printStackTrace();
							rtn = "FAILURE";
						}
					}

			}
			if (arr[2].length() > 0)
			{
				String el[] = arr[2].split("\\^");
				for (int i = 0; i < el.length; i++)
					if (el[i].length() > 0)
					{
						String elem[] = el[i].split("`");
						sql = "insert into flow_log_file(flow_code,id,code,file_lsh,file_name) values('" + elem[0] + "','" + elem[1] + "'," + elem[2] + ",'" + elem[3] + "','" + elem[4] + "')";
						try
						{
							stmt.executeUpdate(sql);
						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}
					}

			}
			if (arr[3].length() > 0)
			{
				String el[] = arr[3].split("`");
				String table = el[0];
				String syntax = "";
				if (el[1].split(";").length >= 1)
				{
					syntax = el[2];
					sql = "update " + table + " set bill_state = -1 where " + syntax;
					try
					{
						stmt.executeUpdate(sql);
					}
					catch (SQLException e)
					{
						e.printStackTrace();
					}
				}
			}
			try
			{
				String toaddr = "";
				String sendusername = "";
				String content = "";
				sql = "select emailaddress from user_list where code = '" + touser + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
					toaddr = rs.getString("emailaddress");
				sql = "select username from user_list where code = '" + senduser + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
					sendusername = rs.getString("username");
				try
				{
					sendtime = (new SimpleDateFormat("yyyy年MM月dd日 HH时mm分")).format((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(sendtime));
				}
				catch (ParseException e)
				{
					try
					{
						sendtime = (new SimpleDateFormat("yyyy年MM月dd日 HH时mm分")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(sendtime));
					}
					catch (ParseException e1)
					{
						e1.printStackTrace();
					}
				}
				StringBuffer sb = new StringBuffer();
				sb.append("事项发送用户:" + sendusername + "（" + senduser + "）\r\n");
				sb.append("事项发送时间:" + sendtime + "\r\n");
				sb.append("事项主题:" + subject);
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("cancelStartFlow"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			if (param.length() > 0)
			{
				String arr[] = param.split("`");
				for (int i = 0; i < arr.length; i++)
				{
					sql = "delete from system_longdata where file_lsh = '" + arr[i] + "'";
					try
					{
						stmt.executeUpdate(sql);
					}
					catch (SQLException e)
					{
						e.printStackTrace();
					}
				}

			}
		}
		if (method.equalsIgnoreCase("validateFuncodeSend"))
		{
			String param = loadRequest(request, response);
			String fun_code = param != null ? param : "";
			String sql = "";
			if (fun_code.length() > 0)
			{
				sql = "select count(*) count from fun_list where code like '" + fun_code + "%' and length('" + fun_code + "') > length(code) and WINPARM_DOUBLE = 1";
				try
				{
					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						if (rs.getInt("count") == 0)
						{
							sql = "select count(*) count from fun_list where winparm_double = 1 and code = '" + fun_code + "'";
							rs = stmt.executeQuery(sql);
							if (rs.next())
							{
								if (rs.getInt("count") == 0)
									rtn = "FAILURE";
								else
								if (rs.getInt("count") == 1)
									rtn = "OK";
							} else
							{
								rtn = "FAILURE";
							}
						} else
						{
							rtn = "FAILURE";
						}
					} else
					{
						rtn = "FAILURE";
					}
				}
				catch (SQLException e)
				{
					e.printStackTrace();
				}
			} else
			{
				rtn = "FAILURE";
			}
		}
		if (method.equalsIgnoreCase("getTablePrimaryKey"))
		{
			String param = loadRequest(request, response);
			String tableName = param;
			String sql = "";
			sql = "select user_cons_columns.column_name FROM user_cons_columns,cols WHERE   user_cons_columns.table_name = '" + tableName.toUpperCase() + "' and user_cons_columns.constraint_name = " + "(select constraint_name from user_constraints where  table_name='" + tableName.toUpperCase() + "' and  constraint_type='P' ) " + "and user_cons_columns.column_name = cols.column_name and user_cons_columns.table_name = cols.table_name " + "order by cols.COLUMN_ID";
			rtn = "";
			try
			{
				for (rs = stmt.executeQuery(sql); rs.next();)
					rtn = rtn + rs.getString("column_name") + ";";

			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getStartStep"))
		{
			String param = loadRequest(request, response);
			String flow_code = param;
			String sql = "";
			sql = "select step_code from flow_step where flow_code = '" + flow_code + "' and setp_type = 0";
			rtn = "";
			try
			{
				rs = stmt.executeQuery(sql);
				if (rs.next())
					rtn = rs.getString("step_code");
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("updateFlowState"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			rtn = "";
			try
			{
				sql = param;
				stmt.executeUpdate(sql);
				rtn = "OK";
			}
			catch (SQLException ex)
			{
				ex.printStackTrace();
				rtn = "FAILURE";
			}
		}
		if (method.equalsIgnoreCase("getDaiban") || method.equalsIgnoreCase("getYichuli"))
		{
			String param = loadRequest(request, response);
			String userid = param;
			String type = "";
			if (method.equalsIgnoreCase("getDaiban"))
				type = "0";
			else
			if (method.equalsIgnoreCase("getYichuli"))
				type = "1";
			try
			{
				con.setAutoCommit(false);
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{ call pkg_flow.flow_listforuser(?, ?, ?) }");
				cstmt.registerOutParameter(3, -10);
				cstmt.setString(1, userid);
				cstmt.setInt(2, Integer.parseInt(type));
				cstmt.execute();
				rs = (ResultSet)cstmt.getObject(3);
				rtn = "";
				while (rs.next()) 
					if (rtn.equalsIgnoreCase(""))
						rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("id") + "`" + rs.getString("flow_step") + "`" + rs.getString("setp_code") + "`" + rs.getString("subject") + "`" + rs.getString("sendtime") + "`" + rs.getString("operator_type") + "`" + rs.getString("step_name") + "`" + rs.getString("userid") + "`" + rs.getString("fun_code") + "`" + rs.getString("from_step");
					else
						rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("id") + "`" + rs.getString("flow_step") + "`" + rs.getString("setp_code") + "`" + rs.getString("subject") + "`" + rs.getString("sendtime") + "`" + rs.getString("operator_type") + "`" + rs.getString("step_name") + "`" + rs.getString("userid") + "`" + rs.getString("fun_code") + "`" + rs.getString("from_step");
				rs.close();
				cstmt.close();
				con.setAutoCommit(true);
			}
			catch (SQLException ex)
			{
				ex.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("updateReading"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String flow_step = arr[2];
			String setp_code = arr[3];
			String sql = "";
			sql = "update flow_log_detail set reading = 1 where flow_code = '" + flow_code + "' and id = '" + flow_id + "' and flow_step = " + Integer.parseInt(flow_step) + " and setp_code = " + Integer.parseInt(setp_code);
			try
			{
				stmt.executeUpdate(sql);
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowHandleAssist"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String flow_step = arr[2];
			String setp_code = arr[3];
			String sql = "";
			try
			{
				sql = "select user_list.username,flow_log_master.create_date,flow_log_master.subject from flow_log_master,user_list where ( flow_log_master.userid = user_list.code ) and flow_log_master.flow_code = '" + flow_code + "' and flow_log_master.id = '" + flow_id + "'";
				rs = stmt.executeQuery(sql);
				rtn = "";
				if (rs.next())
				{
					rtn = rs.getString("subject") + "`" + rs.getString("username") + "`" + rs.getTimestamp("create_date").toString().substring(0, 19);
					sql = "select step_name,operator_type from flow_step where flow_code = '" + flow_code + "' and step_code = " + setp_code;
					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						rtn = rtn + "`" + rs.getString("operator_type") + "`" + rs.getString("step_name");
						sql = "select upper(dw_name) dw_name from flow_master where flow_code = '" + flow_code + "'";
						rs = stmt.executeQuery(sql);
						if (rs.next())
						{
							String tab_name = rs.getString("dw_name");
							sql = "select upper(t2.col_name) col_name, t1.comments comments from user_col_comments t1,(select col_name from flow_step_writeable where flow_code = '" + flow_code + "' and step_code = " + setp_code + " order by id) t2 " + "where t1.column_name (+) = upper(t2.col_name) and t1.table_name(+) = '" + tab_name + "'";
							rs = stmt.executeQuery(sql);
							String tmp;
							for (tmp = ""; rs.next(); tmp = tmp + (rs.getString("comments") != null ? rs.getString("comments") : rs.getString("col_name")) + ",");
							if (tmp == "")
								rtn = rtn + "`<主表>: 无`";
							else
								rtn = rtn + "`<主表>:" + tmp.substring(0, tmp.length() - 1) + "`";
						}
						sql = "select upper(dw_detail) dw_name,dw_detail_name,flow_detail_id from flow_detail where flow_code = '" + flow_code + "'";
						rs = stmt.executeQuery(sql);
						String str;
						String tab_name;
						String tab_com;
						String tab_id;
						for (str = ""; rs.next(); str = str + tab_name + "`" + tab_com + "`" + tab_id + "^")
						{
							tab_name = rs.getString("dw_name");
							tab_com = rs.getString("dw_detail_name");
							tab_id = rs.getString("flow_detail_id");
						}

						if (str.length() > 0)
						{
							rtn = rtn + "<从表>:";
							String strArr[] = str.substring(0, str.length() - 1).split("\\^");
							for (int i = 0; i < strArr.length; i++)
							{
								sql = "select upper(t2.col_name) col_name, t1.comments comments from user_col_comments t1,(select col_name,flow_detail_id from flow_step_detwriteable where flow_code = '" + flow_code + "' and step_code = " + setp_code + " order by id) t2 " + "where t1.column_name (+) = upper(t2.col_name) and t1.table_name(+) = '" + strArr[i].split("`")[0] + "' and t2.flow_detail_id = " + strArr[i].split("`")[2];
								rs = stmt.executeQuery(sql);
								String s = "";
								while (rs.next()) 
									if (rs.getString("col_name").equalsIgnoreCase("is_writeall"))
										s = s + "全部可编辑,";
									else
									if (rs.getString("comments") == "" || rs.getString("comments") == null)
										s = s + rs.getString("col_name") + ",";
									else
										s = s + rs.getString("comments") + ",";
								if (s.length() > 0)
									rtn = rtn + "[" + strArr[i].split("`")[1] + "] " + s.substring(0, s.length() - 1) + " ";
								else
									rtn = rtn + "[" + strArr[i].split("`")[1] + "] 无 ";
							}

						}
					}
					rtn = rtn.replaceAll("null", "");
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
				rtn = "";
			}
		}
		if (method.equalsIgnoreCase("login"))
		{
			String param = loadRequest(request, response);
			param = param.substring(1, param.length() - 1);
			String userid = param.split("`")[0];
			String password = param.split("`")[1];
			String sql = "";
			sql = "select pwd from user_list where code = '" + userid + "'";
			try
			{
				rs = stmt.executeQuery(sql);
				rtn = "";
				if (rs.next())
				{
					if (rs.getString("pwd").equals(password))
						rtn = "OK";
					else
					if (MD5Util.getMd5().md5(password).toUpperCase().equals(rs.getString("pwd").toUpperCase()))
						rtn = "OK";
					else
						rtn = "Failure";
				} else
				{
					rtn = "Failure";
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("canSend"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String source_step = arr[2];
			rtn = "";
			try
			{
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{? = call pkg_flow.canSend(?, ?, ?) }");
				cstmt.setString(2, flow_code);
				cstmt.setString(3, flow_id);
				cstmt.setString(4, source_step);
				cstmt.registerOutParameter(1, 4);
				cstmt.execute();
				int b = cstmt.getInt(1);
				if (b != 1)
					rtn = "FAILURE";
				else
					rtn = "OK";
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getNextSteps"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String flow_step = arr[2];
			String setp_code = arr[3];
			rtn = "";
			try
			{
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{ call pkg_flow.flow_nextsteps(?, ?, ?, ?, ?) }");
				cstmt.setString(1, flow_code);
				cstmt.setString(2, flow_id);
				cstmt.setString(3, flow_step);
				cstmt.setString(4, setp_code);
				cstmt.registerOutParameter(5, 12);
				cstmt.execute();
				rtn = cstmt.getString(5);
				if (rtn.split("#")[0].equalsIgnoreCase("0"))
					rtn = "ERROR";
				else
				if (rtn.split("#")[0].equalsIgnoreCase("1"))
					rtn = "UPDATE";
				else
				if (rtn.split("#")[0].equalsIgnoreCase("-1"))
					rtn = rtn.split("#")[1];
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getBackSteps"))
		{
			String param = loadRequest(request, response);
			String arr[] = param.split("`");
			String flow_code = arr[0];
			String flow_id = arr[1];
			String bh = arr[2];
			rtn = "";
			try
			{
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{ call pkg_flow.flow_backsteps(?, ?, ?, ?) }");
				cstmt.setString(1, flow_code);
				cstmt.setString(2, flow_id);
				cstmt.setString(3, bh);
				cstmt.registerOutParameter(4, 12);
				cstmt.execute();
				rtn = cstmt.getString(4);
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("saveHandleSend"))
		{
			String senduser = "";
			String touser = "";
			String subject = "";
			String sendtime = "";
			String flowid = "";
			String param = loadRequest(request, response);
			String sql = "";
			rtn = "";
			String a3 = param.split("\\$")[0];
			String a2 = param.split("\\$")[1];
			String bh = a3;
			param = a2;
			String el[] = param.split("\\^");
			for (int i = 0; i < el.length; i++)
			{
				if (el[i] == null || el[i].length() <= 0)
					continue;
				String elem[] = el[i].split("`");
				if (!elem[8].equalsIgnoreCase("-1"))
					continue;
				String flow_code = elem[0];
				String flow_id = elem[1];
				sql = "update flow_log_master set flow_state = 1 where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
				try
				{
					stmt.executeUpdate(sql);
					CallableStatement cstmt = null;
					cstmt = con.prepareCall("{? = call pkg_flow.updateParentTab(?,?,?) }");
					cstmt.registerOutParameter(1, 4);
					cstmt.setString(2, flow_code);
					cstmt.setString(3, flow_id);
					cstmt.setString(4, "1");
					cstmt.execute();
					int b = cstmt.getInt(1);
					if (b != 1)
						rtn = "FAILURE";
				}
				catch (SQLException e)
				{
					e.printStackTrace();
					rtn = "FAILURE";
				}
				break;
			}

			if (rtn != "FAILURE")
			{
				int maxbh = (new Integer(bh)).intValue() + 1;
				for (int i = 0; i < el.length; i++)
					if (el[i] != null && el[i].length() > 0)
					{
						String elem[] = el[i].split("`");
						try
						{
							sql = "insert into flow_log_detail(flow_code,id,flow_step,setp_code,reading,sending,sending_object,groupid,from_step) values('" + elem[0] + "','" + elem[1] + "'," + maxbh + "," + elem[3] + "," + elem[4] + "," + elem[5] + ",'" + elem[6] + "','" + elem[7] + "'," + elem[2] + ")";
							stmt.executeUpdate(sql);
							touser = elem[6];
							flowid = elem[1];
						}
						catch (SQLException e)
						{
							e.printStackTrace();
							rtn = "FAILURE";
						}
						try
						{
							String toaddr = "";
							String sendusername = "";
							String content = "";
							sql = "select emailaddress from user_list where code = '" + touser + "'";
							rs = stmt.executeQuery(sql);
							if (rs.next())
								toaddr = rs.getString("emailaddress");
							sql = "select userid, create_date, subject from flow_log_master where id = '" + flowid + "'";
							rs = stmt.executeQuery(sql);
							if (rs.next())
							{
								senduser = rs.getString("userid");
								sendtime = rs.getString("create_date");
								subject = rs.getString("subject");
							}
							sql = "select username from user_list where code = '" + senduser + "'";
							rs = stmt.executeQuery(sql);
							if (rs.next())
								sendusername = rs.getString("username");
							try
							{
								sendtime = (new SimpleDateFormat("yyyy年MM月dd日 HH时mm分")).format((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(sendtime));
							}
							catch (ParseException e)
							{
								try
								{
									sendtime = (new SimpleDateFormat("yyyy年MM月dd日 HH时mm分")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(sendtime));
								}
								catch (ParseException e1)
								{
									e1.printStackTrace();
								}
							}
							StringBuffer sb = new StringBuffer();
							sb.append("事项发送用户:" + sendusername + "（" + senduser + "）\r\n");
							sb.append("事项发送时间:" + sendtime + "\r\n");
							sb.append("事项主题:" + subject);
						}
						catch (SQLException e)
						{
							e.printStackTrace();
						}
					}

			}
			if (rtn != "FAILURE")
				rtn = "OK";
		}
		if (method.equalsIgnoreCase("flowSendPrev"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			rtn = "";
			try
			{
				String elem[] = param.split("`");
				String flow_code = elem[0];
				String flow_id = elem[1];
				String flow_step = elem[2];
				String setp_code = elem[3];
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{call pkg_flow.flow_backOneStep(?,?,?,?,?) }");
				cstmt.setString(1, flow_code);
				cstmt.setString(2, flow_id);
				cstmt.setString(3, flow_step);
				cstmt.setString(4, setp_code);
				cstmt.registerOutParameter(5, 12);
				cstmt.execute();
				rtn = cstmt.getString(5);
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("flowSendBack"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String sql = "";
			sql = "update flow_log_master set flow_state = -1 where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
			try
			{
				stmt.executeUpdate(sql);
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{? = call pkg_flow.updateParentTab(?,?,?) }");
				cstmt.registerOutParameter(1, 4);
				cstmt.setString(2, flow_code);
				cstmt.setString(3, flow_id);
				cstmt.setString(4, "0");
				cstmt.execute();
				int b = cstmt.getInt(1);
				if (b != 1)
					rtn = "FAILURE";
				else
					rtn = "OK";
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
				rtn = "FAILURE";
			}
		}
		if (method.equalsIgnoreCase("flowTakeBack"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String flow_step = param.split("`")[2];
			String setp_code = param.split("`")[3];
			String sql = "";
			java.util.List toDel = new ArrayList();
			try
			{
				sql = "select flow_state from flow_log_master where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
					if (rs.getInt("flow_state") != 0)
					{
						rtn = "该流程已经处理完毕。不能收回！";
					} else
					{
						sql = "select flow_log_detail.* from flow_log_detail,(select * from flow_log_detail where flow_code = '" + flow_code + "'" + " and id = '" + flow_id + "' and flow_step = " + flow_step + " and setp_code = " + setp_code + ") t1 " + "where flow_log_detail.flow_code = t1.flow_code and flow_log_detail.id = t1.id and flow_log_detail.from_step = t1.setp_code and flow_log_detail.flow_step > t1.flow_step";
						rs = stmt.executeQuery(sql);
						boolean flag = true;
						java.util.List el;
						for (; rs.next(); toDel.add(el))
						{
							if (rs.getInt("reading") == 1)
							{
								flag = false;
								break;
							}
							el = new ArrayList();
							el.add(rs.getString("flow_code"));
							el.add(rs.getString("id"));
							el.add(rs.getString("flow_step"));
							el.add(rs.getString("setp_code"));
						}

						if (flag)
						{
							if (toDel.size() == 0)
							{
								rtn = "不存在需收回记录，请检查！";
							} else
							{
								for (int i = 0; i < toDel.size(); i++)
								{
									java.util.List el1 = (java.util.List)toDel.get(i);
									String ls_flow_code = el1.get(0).toString();
									String ls_flow_id = el1.get(1).toString();
									String ls_flow_step = el1.get(2).toString();
									String ls_setp_code = el1.get(3).toString();
									sql = "delete from flow_log_detail where flow_code = '" + ls_flow_code + "' and id = '" + ls_flow_id + "' and flow_step = " + ls_flow_step + " and setp_code = " + ls_setp_code;
									stmt.executeUpdate(sql);
								}

								sql = "update flow_log_detail set sending = 0,sendtime = null where flow_code = '" + flow_code + "' and id = '" + flow_id + "' and flow_step = " + flow_step + " and setp_code = " + setp_code;
								stmt.executeUpdate(sql);
								rtn = "收回流程成功！";
							}
						} else
						{
							rtn = "该文件无法收回，收件人已经处理！";
						}
					}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
				rtn = "收回流程时发生错误，请稍后重试！";
			}
		}
		if (method.equalsIgnoreCase("flowBackFirst"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String flow_step = param.split("`")[2];
			String setp_code = param.split("`")[3];
			String sql = "select max(flow_step) from flow_log_detail where id = '" + flow_id + "'";
			try
			{
				rs = stmt.executeQuery(sql);
				int newid = 0;
				if (rs.next())
					newid = rs.getInt(1) + 1;
				sql = "select userid from flow_log_master where id = '" + flow_id + "'";
				rs = stmt.executeQuery(sql);
				String userid = "";
				if (rs.next())
					userid = rs.getString(1);
				sql = "select step_code from flow_step where flow_code = '" + flow_code + "' and setp_type = '0'";
				rs = stmt.executeQuery(sql);
				String startnode = "";
				if (rs.next())
					startnode = rs.getString(1);
				sql = "update flow_log_detail set sending = '1', sendtime = to_date('" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "', 'yyyy-mm-dd hh24:mi:ss') where id = '" + flow_id + "' and flow_step = '" + flow_step + "' and setp_code = '" + setp_code + "'";
				stmt.executeUpdate(sql);
				sql = "insert into flow_log_detail values('" + flow_code + "', '" + flow_id + "', '" + newid + "', '" + startnode + "', '', '', '', '', '0', '0', '" + userid + "', '', '1', '" + setp_code + "', '1')";
				stmt.executeUpdate(sql);
				rtn = "退回至承办部门成功！";
			}
			catch (SQLException ex)
			{
				ex.printStackTrace();
				rtn = "退回至承办部门操作时发生错误,请联系系统管理员解决！";
			}
		}
		if (method.equalsIgnoreCase("flowResend"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String flow_step = param.split("`")[2];
			String setp_code = param.split("`")[3];
			String sql = "select max(flow_step) from flow_log_detail where id = '" + flow_id + "'";
			try
			{
				rs = stmt.executeQuery(sql);
				int newid = 0;
				if (rs.next())
					newid = rs.getInt(1) + 1;
				sql = "select from_step from flow_log_detail where id = '" + flow_id + "' and flow_step = '" + flow_step + "' and setp_code = '" + setp_code + "'";
				rs = stmt.executeQuery(sql);
				int from_step = 0;
				if (rs.next())
					from_step = rs.getInt(1);
				sql = "select groupid, sending_object from flow_log_detail where id = '" + flow_id + "' and setp_code = '" + from_step + "'";
				rs = stmt.executeQuery(sql);
				String groupid = "";
				String userid = "";
				if (rs.next())
				{
					groupid = rs.getString(1);
					userid = rs.getString(2);
				}
				sql = "update flow_log_detail set sending = '1', sendtime = to_date('" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "', 'yyyy-mm-dd hh24:mi:ss') where id = '" + flow_id + "' and flow_step = '" + flow_step + "' and setp_code = '" + setp_code + "'";
				stmt.executeUpdate(sql);
				sql = "select * from flow_log_detail where id = '" + flow_id + "' and flow_step = '" + flow_step + "' and setp_code = '" + setp_code + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					sql = "insert into flow_log_detail values('" + flow_code + "', '" + flow_id + "', '" + newid + "', '" + rs.getString("from_step") + "', '', '', '', '', '0', '0', '" + userid + "', '', '" + groupid + "', '" + rs.getString("setp_code") + "', '')";
					stmt.executeUpdate(sql);
					rtn = "重新发送给上级审批部门成功！";
				}
			}
			catch (SQLException ex)
			{
				ex.printStackTrace();
				rtn = "重新发送给上级审批部门操作时发生错误,请联系系统管理员解决！";
			}
		}
		if (method.equalsIgnoreCase("FlowCancel"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String sql = "";
			try
			{
				sql = "select flow_state from flow_log_master where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
					if (rs.getInt(1) == 1 || rs.getInt(1) == -1)
					{
						rtn = "该流程已经处理完毕，不能取消！";
					} else
					{
						CallableStatement cstmt = null;
						cstmt = con.prepareCall("{? = call pkg_flow.updateParentTab(?,?,?) }");
						cstmt.registerOutParameter(1, 4);
						cstmt.setString(2, flow_code);
						cstmt.setString(3, flow_id);
						cstmt.setString(4, "0");
						cstmt.execute();
						int b = cstmt.getInt(1);
						cstmt.close();
						if (b != 1)
						{
							rtn = "取消该流程时发生错误!";
						} else
						{
							sql = "delete from flow_log_file where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
							stmt.executeUpdate(sql);
							sql = "delete from flow_log_detail where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
							stmt.executeUpdate(sql);
							sql = "delete from flow_log_master where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
							stmt.executeUpdate(sql);
							rtn = "取消流程成功!";
						}
					}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
				rtn = "取消该流程时发生错误!";
			}
		}
		if (method.equalsIgnoreCase("getAccessControl"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String flow_step = param.split("`")[2];
			String setp_code = param.split("`")[3];
			String fun_code = "";
			rtn = "";
			String tmp = "";
			String detail = "";
			java.util.List list = new ArrayList();
			try
			{
				sql = "select fun_code,dw_name from flow_master where flow_code = '" + flow_code + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					rtn = "<?xml version=\"1.0\" encoding=\"GB2312\" ?><root>";
					fun_code = rs.getString("fun_code");
					sql = "select t1.dbnetgrid,t2.tablename from (select '" + flow_code + "' flow_code, bh, name dbnetgrid from flow_dw where id = '" + fun_code + "' order by bh) t1, " + "(select flow_code, 1 bh, dw_name tablename from flow_master where flow_code = '" + flow_code + "' " + "union " + "select flow_code, flow_detail_id + 1 bh, dw_detail tablename from flow_detail where flow_code = '" + flow_code + "' " + "order by 2) t2 where t1.flow_code = t2.flow_code and t1.bh = t2.bh ";
					for (rs = stmt.executeQuery(sql); rs.next(); list.add(rs.getString("dbnetgrid") + "`" + rs.getString("tablename")));
					if (list.size() > 0)
					{
						for (int i = 0; i < list.size(); i++)
							if (i == 0)
							{
								rtn = rtn + "<master><dbnetgrid>";
								tmp = list.get(i).toString().split("`")[0];
								rtn = rtn + "<name>" + tmp + "</name>";
								tmp = list.get(i).toString().split("`")[1];
								rtn = rtn + "<tablename>" + tmp + "</tablename>";
								sql = "select col_name from flow_step where flow_code = '" + flow_code + "' and step_code = " + setp_code;
								rs = stmt.executeQuery(sql);
								if (rs.next())
								{
									tmp = rs.getString("col_name") != null ? rs.getString("col_name") : "";
									rtn = rtn + "<signature>" + tmp + "</signature>";
								}
								sql = "select col_name from flow_step_writeable where flow_code = '" + flow_code + "' and step_code = " + setp_code + " order by id";
								rs = stmt.executeQuery(sql);
								for (tmp = ""; rs.next(); tmp = tmp + rs.getString("col_name") + "`");
								if (tmp.length() > 0)
									tmp = tmp.substring(0, tmp.length() - 1);
								rtn = rtn + "<required>" + tmp + "</required>";
								rtn = rtn + "</dbnetgrid></master>";
							} else
							{
								detail = detail + "<dbnetgrid>";
								tmp = list.get(i).toString().split("`")[0];
								detail = detail + "<name>" + tmp + "</name>";
								tmp = list.get(i).toString().split("`")[1];
								detail = detail + "<tablename>" + tmp + "</tablename>";
								sql = "select t2.col_name from flow_detail t1,flow_step_detwriteable t2 where t1.flow_code = t2.flow_code and t1.flow_code = '" + flow_code + "' and " + "t1.flow_detail_id = t2.flow_detail_id and t2.step_code = " + setp_code + " and lower(t1.dw_detail) = lower('" + tmp + "') order by t2.id";
								rs = stmt.executeQuery(sql);
								for (tmp = ""; rs.next(); tmp = tmp + rs.getString("col_name") + "`");
								if (tmp.length() > 0)
									tmp = tmp.substring(0, tmp.length() - 1);
								detail = detail + "<required>" + tmp + "</required>";
								detail = detail + "</dbnetgrid>";
							}

						rtn = rtn + "<detail>" + detail + "</detail>" + "</root>";
					}
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getTableCols"))
		{
			String param = loadRequest(request, response);
			String tableName = param;
			String sql = "";
			rtn = "";
			try
			{
				sql = "select table_name || '.' || column_name as column_name from sys.user_tab_cols t where t.table_name = '" + tableName + "' order by t.column_id";
				for (rs = stmt.executeQuery(sql); rs.next();)
					if (rtn.equalsIgnoreCase(""))
						rtn = rs.getString("column_name");
					else
						rtn = rtn + "`" + rs.getString("column_name");

			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("updateGridSignCol"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String flow_step = param.split("`")[2];
			String setp_code = param.split("`")[3];
			String userid = param.split("`")[4];
			rtn = "";
			try
			{
				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{? = call pkg_flow.updateTableSignCol(?,?,?,?) }");
				cstmt.registerOutParameter(1, 4);
				cstmt.setString(2, flow_code);
				cstmt.setString(3, flow_id);
				cstmt.setString(4, setp_code);
				cstmt.setString(5, userid);
				cstmt.execute();
				cstmt.close();
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getRetrieveCondition"))
		{
			String param = loadRequest(request, response);
			String sql = "";
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String fun_code = "";
			String grid = "";
			rtn = "";
			try
			{
				sql = "select fun_code,dw_name from flow_master where flow_code = '" + flow_code + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					fun_code = rs.getString("fun_code");
					sql = "select name dbnetgrid from flow_dw where id = '" + fun_code + "' order by bh";
					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						grid = rs.getString("dbnetgrid");
						CallableStatement cstmt = null;
						cstmt = con.prepareCall("{? = call pkg_flow.getupdateparentwheresql(?,?) }");
						cstmt.registerOutParameter(1, 12);
						cstmt.setString(2, flow_code);
						cstmt.setString(3, flow_id);
						cstmt.execute();
						String ls_where = cstmt.getString(1);
						ls_where = ls_where.substring(7);
						cstmt.close();
						rtn = grid + "`" + ls_where;
					}
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFunPrintTemplate"))
		{
			String param = loadRequest(request, response);
			String funcode = param.split("`")[0];
			String funprintid = param.split("`")[1];
			String sql = "";
			rtn = "";
			try
			{
				sql = "select file_lsh from fun_print_zb where fun_code = '" + funcode + "' and fun_print_id = '" + funprintid + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					String lsh = rs.getString("file_lsh") != null ? rs.getString("file_lsh") : "";
					rtn = lsh;
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowPrintTemplate"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String sql = "";
			rtn = "";
			try
			{
				sql = "select file_lsh, is_rowdata, dw_name from flow_master where flow_code = '" + flow_code + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					String lsh = rs.getString("file_lsh") != null ? rs.getString("file_lsh") : "";
					if (rs.getInt("is_rowdata") == 1)
					{
						String tableName = rs.getString("dw_name");
						if (tableName == null || tableName.equalsIgnoreCase(""))
						{
							rtn = lsh;
						} else
						{
							sql = "select retrieve_condition from flow_log_master where flow_code = '" + flow_code + "' and id = '" + flow_id + "'";
							rs = stmt.executeQuery(sql);
							if (rs.next())
							{
								String whereStr = rs.getString("retrieve_condition");
								if (whereStr == null || whereStr.equalsIgnoreCase(""))
									rtn = lsh;
								else
								if (tableName.toLowerCase().equals("gczl_jl"))
								{
									whereStr = whereStr.toLowerCase().replaceAll("gczl_jl.", "");
									sql = "select file_lsh from " + tableName + "_file where " + whereStr;
									rs = stmt.executeQuery(sql);
									if (rs.next())
										rtn = rs.getString("file_lsh") != null ? rs.getString("file_lsh") : lsh;
									else
										rtn = lsh;
								} else
								{
									sql = "select file_lsh from " + tableName + " where " + whereStr;
									rs = stmt.executeQuery(sql);
									if (rs.next())
										rtn = rs.getString("file_lsh") != null ? rs.getString("file_lsh") : lsh;
								}
							}
						}
					} else
					{
						rtn = lsh;
					}
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFunPrintSet"))
		{
			Document backDoc = new Document(new Element("root"));
			Document gridset = loadRequest1(request, response);
			String fun_code = gridset.getRootElement().getChildText("funcode");
			String fun_print_id = gridset.getRootElement().getChildText("funprintid");
			java.util.List gridnodes = gridset.getRootElement().getChild("dbnetgrids").getChildren();
			String flow_id = "";
			String sql = "";
			rtn = "";
			try
			{
				sql = "select data_type,flow_step,dw_colname,file_bookmarks,is_numbertochina,data_grid,data_repeat from fun_print_xb where fun_code = '" + fun_code + "' and fun_print_id = '" + fun_print_id + "' order by data_type,data_grid,bh,flow_step";
				rs = stmt.executeQuery(sql);
				java.util.List list = new ArrayList();
				java.util.List listzb = new ArrayList();
				java.util.List listxb = new ArrayList();
				java.util.List listlc = new ArrayList();
				String lastflag = "";
				java.util.List tmp = null;
				HashMap hmap = new HashMap();
				while (rs.next()) 
				{
					java.util.List el = new ArrayList();
					el.add(rs.getString("file_bookmarks"));
					el.add(rs.getString("flow_step") != null ? ((Object) (rs.getString("flow_step"))) : "");
					el.add(rs.getString("dw_colname") != null ? ((Object) (rs.getString("dw_colname"))) : "");
					el.add(rs.getString("is_numbertochina") != null ? ((Object) (rs.getString("is_numbertochina"))) : "0");
					el.add(rs.getString("data_grid") != null ? ((Object) (rs.getString("data_grid"))) : "");
					el.add(rs.getString("data_repeat") != null ? ((Object) (rs.getString("data_repeat"))) : "0");
					String datatype = rs.getString("data_type");
					if (datatype.equalsIgnoreCase("1"))
						listzb.add(el);
					else
					if (datatype.equalsIgnoreCase("3"))
					{
						if (!rs.getString("data_grid").equalsIgnoreCase(lastflag))
						{
							if (tmp != null)
								listxb.add(tmp);
							tmp = new ArrayList();
							lastflag = rs.getString("data_grid");
						}
						tmp.add(el);
					} else
					if (datatype.equalsIgnoreCase("2"))
						listlc.add(el);
				}
				if (tmp != null)
					listxb.add(tmp);
				sql = "select flow_log_detail.setp_code setp_code,flow_log_detail.signature signature,flow_log_detail.opinion opinion,user_list.file_lsh file_lsh, flow_log_detail.datetime dt from flow_log_detail,user_list where flow_log_detail.signature = user_list.code(+) and flow_log_detail.id = '" + flow_id + "'";
				java.util.List ele;
				for (rs = stmt.executeQuery(sql); rs.next(); hmap.put(rs.getString("setp_code"), ele))
				{
					ele = new ArrayList();
					ele.add(rs.getString("signature") != null ? ((Object) (rs.getString("signature"))) : "");
					ele.add(rs.getString("opinion") != null ? ((Object) (rs.getString("opinion"))) : "");
					ele.add(rs.getString("file_lsh") != null ? ((Object) (rs.getString("file_lsh"))) : "");
					ele.add(rs.getString("dt") != null ? ((Object) (rs.getString("dt"))) : "");
				}

				if (listzb.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("zb"));
					Element zbNode = backDoc.getRootElement().getChild("zb");
					String gridid = ((java.util.List)listzb.get(0)).get(4).toString();
					java.util.List lookups = null;
					for (int i = 0; i < gridnodes.size(); i++)
					{
						Element node = (Element)gridnodes.get(i);
						if (!node.getAttributeValue("id").equalsIgnoreCase(gridid))
							continue;
						sql = node.getChildText("sql");
						lookups = node.getChild("lookups").getChildren();
						break;
					}

					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						for (int i = 0; i < listzb.size(); i++)
						{
							String bookmark = (String)((java.util.List)listzb.get(i)).get(0);
							String flow_step = (String)((java.util.List)listzb.get(i)).get(1);
							String dw_colname = (String)((java.util.List)listzb.get(i)).get(2);
							String is_numbertochina = (String)((java.util.List)listzb.get(i)).get(3);
							String data_repeat = (String)((java.util.List)listzb.get(i)).get(5);
							Element lookup = null;
							if (lookups.size() > 0)
							{
								for (int j = 0; j < lookups.size(); j++)
								{
									if (!((Element)lookups.get(j)).getAttributeValue("col").equalsIgnoreCase(dw_colname))
										continue;
									lookup = (Element)lookups.get(j);
									break;
								}

							}
							if (dw_colname.indexOf(".") != -1)
								dw_colname = dw_colname.substring(dw_colname.indexOf(".") + 1);
							String value = rs.getString(dw_colname);
							if (is_numbertochina.equalsIgnoreCase("1"))
								value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
							value = value != null ? value : "";
							if (lookup != null && !value.equalsIgnoreCase(""))
							{
								String ic = lookup.getAttributeValue("ic");
								String dc = lookup.getAttributeValue("dc");
								String tn = lookup.getAttributeValue("tn");
								String filter = lookup.getChildText("filter");
								StringBuffer sb = new StringBuffer();
								sb.append("select ");
								sb.append(dc);
								sb.append(" from ");
								sb.append(tn);
								sb.append(" where ");
								sb.append(ic);
								sb.append(" = '");
								sb.append(value);
								sb.append("'");
								String sqltext = sb.toString();
								Statement stm = con.createStatement();
								ResultSet r = stm.executeQuery(sqltext);
								if (r.next())
								{
									String des = r.getString(dc);
									if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
										value = des;
								}
								stm.close();
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", "1");
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							zbNode.addContent(el);
						}

					}
				}
				if (listxb.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("xb"));
					Element xbNode = backDoc.getRootElement().getChild("xb");
					java.util.List lookups = null;
					for (int i = 0; i < listxb.size(); i++)
					{
						java.util.List xbs = (java.util.List)listxb.get(i);
						if (xbs.size() > 0)
						{
							Element gridNode = new Element("grid" + i);
							xbNode.addContent(gridNode);
							String gridid = ((java.util.List)xbs.get(0)).get(4).toString();
							for (int j = 0; j < gridnodes.size(); j++)
							{
								Element node = (Element)gridnodes.get(j);
								if (!node.getAttributeValue("id").equalsIgnoreCase(gridid))
									continue;
								sql = node.getChildText("sql");
								lookups = node.getChild("lookups").getChildren();
								break;
							}

							rs = stmt.executeQuery(sql);
							int flag;
							for (flag = 0; rs.next(); flag++)
							{
								for (int j = 0; j < xbs.size(); j++)
								{
									String bookmark = (String)((java.util.List)xbs.get(j)).get(0);
									String flow_step = (String)((java.util.List)xbs.get(j)).get(1);
									String dw_colname = (String)((java.util.List)xbs.get(j)).get(2);
									String is_numbertochina = (String)((java.util.List)xbs.get(j)).get(3);
									String data_repeat = (String)((java.util.List)xbs.get(j)).get(5);
									Element lookup = null;
									if (lookups.size() > 0)
									{
										for (int l = 0; l < lookups.size(); l++)
										{
											if (!((Element)lookups.get(l)).getAttributeValue("col").equalsIgnoreCase(dw_colname))
												continue;
											lookup = (Element)lookups.get(l);
											break;
										}

									}
									if (dw_colname.indexOf(".") != -1)
										dw_colname = dw_colname.substring(dw_colname.indexOf(".") + 1);
									if (data_repeat.equalsIgnoreCase("1"))
									{
										String value = rs.getString(dw_colname);
										if (is_numbertochina.equalsIgnoreCase("1"))
											value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
										value = value != null ? value : "";
										if (lookup != null && !value.equalsIgnoreCase(""))
										{
											String ic = lookup.getAttributeValue("ic");
											String dc = lookup.getAttributeValue("dc");
											String tn = lookup.getAttributeValue("tn");
											String filter = lookup.getChildText("filter");
											StringBuffer sb = new StringBuffer();
											sb.append("select ");
											sb.append(dc);
											sb.append(" from ");
											sb.append(tn);
											sb.append(" where ");
											sb.append(ic);
											sb.append(" = '");
											sb.append(value);
											sb.append("'");
											String sqltext = sb.toString();
											Statement stm = con.createStatement();
											ResultSet r = stm.executeQuery(sqltext);
											if (r.next())
											{
												String des = r.getString(dc);
												if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
													value = des;
											}
											stm.close();
										}
										if (value.equalsIgnoreCase(""))
											value = " ";
										if (flag == 0)
										{
											Element el = new Element("bookmark");
											Element tmpel = buildNode("name", bookmark);
											el.addContent(tmpel);
											tmpel = buildNode("type", "1");
											el.addContent(tmpel);
											tmpel = buildNode("value", value);
											el.addContent(tmpel);
											gridNode.addContent(el);
										} else
										{
											java.util.List bmNodes = gridNode.getChildren("bookmark");
											for (int k = 0; k < bmNodes.size(); k++)
												if (((Element)bmNodes.get(k)).getChild("name").getText().equals(bookmark))
												{
													Element bmNode = (Element)bmNodes.get(k);
													bmNode.getChild("value").setContent(0, new CDATA(bmNode.getChild("value").getText() + "`" + value));
												}

										}
									} else
									{
										String value = rs.getString(dw_colname);
										if (is_numbertochina.equalsIgnoreCase("1"))
											value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
										value = value != null ? value : "";
										if (lookup != null && !value.equalsIgnoreCase(""))
										{
											String ic = lookup.getAttributeValue("ic");
											String dc = lookup.getAttributeValue("dc");
											String tn = lookup.getAttributeValue("tn");
											String filter = lookup.getChildText("filter");
											StringBuffer sb = new StringBuffer();
											sb.append("select ");
											sb.append(dc);
											sb.append(" from ");
											sb.append(tn);
											sb.append(" where ");
											sb.append(ic);
											sb.append(" = '");
											sb.append(value);
											sb.append("'");
											String sqltext = sb.toString();
											Statement stm = con.createStatement();
											ResultSet r = stm.executeQuery(sqltext);
											if (r.next())
											{
												String des = r.getString(dc);
												if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
													value = des;
											}
											stm.close();
										}
										if (value.equalsIgnoreCase(""))
											value = " ";
										if (flag == 0)
										{
											Element el = new Element("bookmark");
											Element tmpel = buildNode("name", bookmark);
											el.addContent(tmpel);
											tmpel = buildNode("type", "1");
											el.addContent(tmpel);
											tmpel = buildNode("value", value);
											el.addContent(tmpel);
											gridNode.addContent(el);
										}
									}
								}

							}

							gridNode.setAttribute("rows", String.valueOf(flag));
						}
					}

				}
				if (listlc.size() > 0)
				{
					PreparedStatement pstmt = con.prepareStatement("select username from user_list where code = ?");
					backDoc.getRootElement().addContent(new Element("lc"));
					Element lcNode = backDoc.getRootElement().getChild("lc");
					for (int i = 0; i < listlc.size(); i++)
					{
						String bookmark = (String)((java.util.List)listlc.get(i)).get(0);
						String flow_step = (String)((java.util.List)listlc.get(i)).get(1);
						String dw_colname = (String)((java.util.List)listlc.get(i)).get(2);
						String is_numbertochina = (String)((java.util.List)listlc.get(i)).get(3);
						String data_repeat = (String)((java.util.List)listlc.get(i)).get(5);
						java.util.List val = (java.util.List)hmap.get(flow_step);
						if (val != null)
						{
							String signature = (String)val.get(0);
							String opinion = (String)val.get(1);
							String file_lsh = (String)val.get(2);
							String datetime = (String)val.get(3);
							String value = "";
							String texttype = "1";
							if (dw_colname.equalsIgnoreCase("signature"))
							{
								if (file_lsh != null && !file_lsh.equalsIgnoreCase(""))
								{
									value = file_lsh;
									value = "/pmis/file/attach.do?pk=" + value;
									texttype = "2";
								} else
								{
									pstmt.setString(1, signature);
									rs = pstmt.executeQuery();
									if (rs.next())
										value = rs.getString("username");
									else
										value = signature;
								}
							} else
							if (dw_colname.equalsIgnoreCase("opinion"))
								value = opinion != null ? opinion : "";
							else
							if (dw_colname.equalsIgnoreCase("datetime"))
							{
								value = datetime != null ? datetime : "";
								if (!value.equalsIgnoreCase(""))
									try
									{
										value = (new SimpleDateFormat("yyyy年MM月dd日")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(value));
									}
									catch (ParseException e1)
									{
										e1.printStackTrace();
									}
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", texttype);
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							lcNode.addContent(el);
						}
					}

					pstmt.close();
				}
				String xml = new String(outputToString(backDoc, "GBK").getBytes("GBK"), "ISO-8859-1");
				response.setContentType("text/xml");
				sendXmlBack(xml, response);
				destroyConnection();
				return;
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowPrintSet1"))
		{
			Document backDoc = new Document(new Element("root"));
			Document gridset = loadRequest1(request, response);
			String flow_code = gridset.getRootElement().getChildText("flow_code");
			String flow_id = gridset.getRootElement().getChildText("flow_id");
			java.util.List gridnodes = gridset.getRootElement().getChild("dbnetgrids").getChildren();
			String sql = "";
			rtn = "";
			try
			{
				sql = "select data_type,flow_step,dw_colname,file_bookmarks,is_numbertochina,data_grid,data_repeat from flow_print where flow_code = '" + flow_code + "' order by data_type,data_grid,bh,flow_step";
				rs = stmt.executeQuery(sql);
				java.util.List list = new ArrayList();
				java.util.List listzb = new ArrayList();
				java.util.List listxb = new ArrayList();
				java.util.List listlc = new ArrayList();
				java.util.List listlczb = new ArrayList();
				String lastflag = "";
				java.util.List tmp = null;
				HashMap hmap = new HashMap();
				HashMap lczbhmap = new HashMap();
				while (rs.next()) 
				{
					java.util.List el = new ArrayList();
					el.add(rs.getString("file_bookmarks"));
					el.add(rs.getString("flow_step") != null ? ((Object) (rs.getString("flow_step"))) : "");
					el.add(rs.getString("dw_colname") != null ? ((Object) (rs.getString("dw_colname"))) : "");
					el.add(rs.getString("is_numbertochina") != null ? ((Object) (rs.getString("is_numbertochina"))) : "0");
					el.add(rs.getString("data_grid") != null ? ((Object) (rs.getString("data_grid"))) : "");
					el.add(rs.getString("data_repeat") != null ? ((Object) (rs.getString("data_repeat"))) : "0");
					String datatype = rs.getString("data_type");
					if (datatype.equalsIgnoreCase("1"))
						listzb.add(el);
					else
					if (datatype.equalsIgnoreCase("3"))
					{
						if (!rs.getString("data_grid").equalsIgnoreCase(lastflag))
						{
							if (tmp != null)
								listxb.add(tmp);
							tmp = new ArrayList();
							lastflag = rs.getString("data_grid");
						}
						tmp.add(el);
					} else
					if (datatype.equalsIgnoreCase("2"))
						listlc.add(el);
					else
					if (datatype.equalsIgnoreCase("4"))
						listlczb.add(el);
				}
				if (tmp != null)
					listxb.add(tmp);
				sql = "select flow_log_detail.setp_code setp_code,flow_log_detail.signature signature,flow_log_detail.opinion opinion,user_list.file_lsh file_lsh, flow_log_detail.datetime dt from flow_log_detail,user_list where flow_log_detail.signature = user_list.code(+) and flow_log_detail.id = '" + flow_id + "'";
				java.util.List ele;
				for (rs = stmt.executeQuery(sql); rs.next(); hmap.put(rs.getString("setp_code"), ele))
				{
					ele = new ArrayList();
					ele.add(rs.getString("signature") != null ? ((Object) (rs.getString("signature"))) : "");
					ele.add(rs.getString("opinion") != null ? ((Object) (rs.getString("opinion"))) : "");
					ele.add(rs.getString("file_lsh") != null ? ((Object) (rs.getString("file_lsh"))) : "");
					ele.add(rs.getString("dt") != null ? ((Object) (rs.getString("dt"))) : "");
				}

				sql = "select flow_log_master.userid userid, flow_log_master.create_date create_date, flow_log_master.subject subject, user_list.file_lsh file_lsh, user_list.username username from flow_log_master,user_list where flow_log_master.userid = user_list.code(+) and flow_log_master.id = '" + flow_id + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					java.util.List ele1 = new ArrayList();
					ele1.add(rs.getString("userid") != null ? ((Object) (rs.getString("userid"))) : "");
					ele1.add(rs.getString("create_date") != null ? ((Object) (rs.getString("create_date"))) : "");
					ele1.add(rs.getString("subject") != null ? ((Object) (rs.getString("subject"))) : "");
					ele1.add(rs.getString("file_lsh") != null ? ((Object) (rs.getString("file_lsh"))) : "");
					ele1.add(rs.getString("username") != null ? ((Object) (rs.getString("username"))) : "");
					lczbhmap.put(flow_id, ele1);
				}
				if (listzb.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("zb"));
					Element zbNode = backDoc.getRootElement().getChild("zb");
					String gridid = ((java.util.List)listzb.get(0)).get(4).toString();
					java.util.List lookups = null;
					for (int i = 0; i < gridnodes.size(); i++)
					{
						Element node = (Element)gridnodes.get(i);
						if (!node.getAttributeValue("id").equalsIgnoreCase(gridid))
							continue;
						sql = node.getChildText("sql");
						lookups = node.getChild("lookups").getChildren();
						break;
					}

					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						for (int i = 0; i < listzb.size(); i++)
						{
							String bookmark = (String)((java.util.List)listzb.get(i)).get(0);
							String flow_step = (String)((java.util.List)listzb.get(i)).get(1);
							String dw_colname = (String)((java.util.List)listzb.get(i)).get(2);
							String is_numbertochina = (String)((java.util.List)listzb.get(i)).get(3);
							String data_repeat = (String)((java.util.List)listzb.get(i)).get(5);
							Element lookup = null;
							if (lookups.size() > 0)
							{
								for (int j = 0; j < lookups.size(); j++)
								{
									if (!((Element)lookups.get(j)).getAttributeValue("col").equalsIgnoreCase(dw_colname))
										continue;
									lookup = (Element)lookups.get(j);
									break;
								}

							}
							if (dw_colname.indexOf(".") != -1)
								dw_colname = dw_colname.substring(dw_colname.indexOf(".") + 1);
							String value = rs.getString(dw_colname);
							if (is_numbertochina.equalsIgnoreCase("1"))
								value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
							value = value != null ? value : "";
							if (lookup != null && !value.equalsIgnoreCase(""))
							{
								String ic = lookup.getAttributeValue("ic");
								String dc = lookup.getAttributeValue("dc");
								String tn = lookup.getAttributeValue("tn");
								String filter = lookup.getChildText("filter");
								StringBuffer sb = new StringBuffer();
								sb.append("select ");
								sb.append(dc);
								sb.append(" from ");
								sb.append(tn);
								sb.append(" where ");
								sb.append(ic);
								sb.append(" = '");
								sb.append(value);
								sb.append("'");
								String sqltext = sb.toString();
								Statement stm = con.createStatement();
								ResultSet r = stm.executeQuery(sqltext);
								if (r.next())
								{
									String des = r.getString(dc);
									if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
										value = des;
								}
								stm.close();
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", "1");
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							zbNode.addContent(el);
						}

					}
				}
				if (listxb.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("xb"));
					Element xbNode = backDoc.getRootElement().getChild("xb");
					java.util.List lookups = null;
					for (int i = 0; i < listxb.size(); i++)
					{
						java.util.List xbs = (java.util.List)listxb.get(i);
						if (xbs.size() > 0)
						{
							Element gridNode = new Element("grid" + i);
							xbNode.addContent(gridNode);
							String gridid = ((java.util.List)xbs.get(0)).get(4).toString();
							for (int j = 0; j < gridnodes.size(); j++)
							{
								Element node = (Element)gridnodes.get(j);
								if (!node.getAttributeValue("id").equalsIgnoreCase(gridid))
									continue;
								sql = node.getChildText("sql");
								lookups = node.getChild("lookups").getChildren();
								break;
							}

							rs = stmt.executeQuery(sql);
							int flag;
							for (flag = 0; rs.next(); flag++)
							{
								for (int j = 0; j < xbs.size(); j++)
								{
									String bookmark = (String)((java.util.List)xbs.get(j)).get(0);
									String flow_step = (String)((java.util.List)xbs.get(j)).get(1);
									String dw_colname = (String)((java.util.List)xbs.get(j)).get(2);
									String is_numbertochina = (String)((java.util.List)xbs.get(j)).get(3);
									String data_repeat = (String)((java.util.List)xbs.get(j)).get(5);
									Element lookup = null;
									if (lookups.size() > 0)
									{
										for (int l = 0; l < lookups.size(); l++)
										{
											if (!((Element)lookups.get(l)).getAttributeValue("col").equalsIgnoreCase(dw_colname))
												continue;
											lookup = (Element)lookups.get(l);
											break;
										}

									}
									if (dw_colname.indexOf(".") != -1)
										dw_colname = dw_colname.substring(dw_colname.indexOf(".") + 1);
									if (data_repeat.equalsIgnoreCase("1"))
									{
										String value = rs.getString(dw_colname);
										if (is_numbertochina.equalsIgnoreCase("1"))
											value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
										value = value != null ? value : "";
										if (lookup != null && !value.equalsIgnoreCase(""))
										{
											String ic = lookup.getAttributeValue("ic");
											String dc = lookup.getAttributeValue("dc");
											String tn = lookup.getAttributeValue("tn");
											String filter = lookup.getChildText("filter");
											StringBuffer sb = new StringBuffer();
											sb.append("select ");
											sb.append(dc);
											sb.append(" from ");
											sb.append(tn);
											sb.append(" where ");
											sb.append(ic);
											sb.append(" = '");
											sb.append(value);
											sb.append("'");
											String sqltext = sb.toString();
											Statement stm = con.createStatement();
											ResultSet r = stm.executeQuery(sqltext);
											if (r.next())
											{
												String des = r.getString(dc);
												if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
													value = des;
											}
											stm.close();
										}
										if (value.equalsIgnoreCase(""))
											value = " ";
										if (flag == 0)
										{
											Element el = new Element("bookmark");
											Element tmpel = buildNode("name", bookmark);
											el.addContent(tmpel);
											tmpel = buildNode("type", "1");
											el.addContent(tmpel);
											tmpel = buildNode("value", value);
											el.addContent(tmpel);
											gridNode.addContent(el);
										} else
										{
											java.util.List bmNodes = gridNode.getChildren("bookmark");
											for (int k = 0; k < bmNodes.size(); k++)
												if (((Element)bmNodes.get(k)).getChild("name").getText().equals(bookmark))
												{
													Element bmNode = (Element)bmNodes.get(k);
													bmNode.getChild("value").setContent(0, new CDATA(bmNode.getChild("value").getText() + "`" + value));
												}

										}
									} else
									{
										String value = rs.getString(dw_colname);
										if (is_numbertochina.equalsIgnoreCase("1"))
											value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
										value = value != null ? value : "";
										if (lookup != null && !value.equalsIgnoreCase(""))
										{
											String ic = lookup.getAttributeValue("ic");
											String dc = lookup.getAttributeValue("dc");
											String tn = lookup.getAttributeValue("tn");
											String filter = lookup.getChildText("filter");
											StringBuffer sb = new StringBuffer();
											sb.append("select ");
											sb.append(dc);
											sb.append(" from ");
											sb.append(tn);
											sb.append(" where ");
											sb.append(ic);
											sb.append(" = '");
											sb.append(value);
											sb.append("'");
											String sqltext = sb.toString();
											Statement stm = con.createStatement();
											ResultSet r = stm.executeQuery(sqltext);
											if (r.next())
											{
												String des = r.getString(dc);
												if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
													value = des;
											}
											stm.close();
										}
										if (value.equalsIgnoreCase(""))
											value = " ";
										if (flag == 0)
										{
											Element el = new Element("bookmark");
											Element tmpel = buildNode("name", bookmark);
											el.addContent(tmpel);
											tmpel = buildNode("type", "1");
											el.addContent(tmpel);
											tmpel = buildNode("value", value);
											el.addContent(tmpel);
											gridNode.addContent(el);
										}
									}
								}

							}

							gridNode.setAttribute("rows", String.valueOf(flag));
						}
					}

				}
				if (listlc.size() > 0)
				{
					PreparedStatement pstmt = con.prepareStatement("select username from user_list where code = ?");
					backDoc.getRootElement().addContent(new Element("lc"));
					Element lcNode = backDoc.getRootElement().getChild("lc");
					for (int i = 0; i < listlc.size(); i++)
					{
						String bookmark = (String)((java.util.List)listlc.get(i)).get(0);
						String flow_step = (String)((java.util.List)listlc.get(i)).get(1);
						String dw_colname = (String)((java.util.List)listlc.get(i)).get(2);
						String is_numbertochina = (String)((java.util.List)listlc.get(i)).get(3);
						String data_repeat = (String)((java.util.List)listlc.get(i)).get(5);
						java.util.List val = (java.util.List)hmap.get(flow_step);
						if (val != null)
						{
							String signature = (String)val.get(0);
							String opinion = (String)val.get(1);
							String file_lsh = (String)val.get(2);
							String datetime = (String)val.get(3);
							String value = "";
							String texttype = "1";
							if (dw_colname.equalsIgnoreCase("signature"))
							{
								if (file_lsh != null && !file_lsh.equalsIgnoreCase(""))
								{
									value = file_lsh;
									value = "/pmis/file/attach.do?pk=" + value;
									texttype = "2";
								} else
								{
									pstmt.setString(1, signature);
									rs = pstmt.executeQuery();
									if (rs.next())
										value = rs.getString("username");
									else
										value = signature;
								}
							} else
							if (dw_colname.equalsIgnoreCase("opinion"))
								value = opinion != null ? opinion : "";
							else
							if (dw_colname.equalsIgnoreCase("datetime"))
							{
								value = datetime != null ? datetime : "";
								if (!value.equalsIgnoreCase(""))
									try
									{
										value = (new SimpleDateFormat("yyyy年MM月dd日")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(value));
									}
									catch (ParseException e1)
									{
										e1.printStackTrace();
									}
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", texttype);
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							lcNode.addContent(el);
						}
					}

					if (listlczb.size() > 0)
					{
						backDoc.getRootElement().addContent(new Element("lczb"));
						Element lczbNode = backDoc.getRootElement().getChild("lczb");
						for (int i = 0; i < listlczb.size(); i++)
						{
							String bookmark = (String)((java.util.List)listlczb.get(i)).get(0);
							String flow_step = (String)((java.util.List)listlczb.get(i)).get(1);
							String dw_colname = (String)((java.util.List)listlczb.get(i)).get(2);
							String is_numbertochina = (String)((java.util.List)listlczb.get(i)).get(3);
							String data_repeat = (String)((java.util.List)listlczb.get(i)).get(5);
							java.util.List val = (java.util.List)lczbhmap.get(flow_id);
							if (val != null)
							{
								String userid = (String)val.get(0);
								String create_date = (String)val.get(1);
								String subject = (String)val.get(2);
								String file_lsh = (String)val.get(3);
								String username = (String)val.get(4);
								String value = "";
								String texttype = "1";
								if (dw_colname.equalsIgnoreCase("userid"))
								{
									if (file_lsh != null && !file_lsh.equalsIgnoreCase(""))
									{
										value = file_lsh;
										value = "/pmis/file/attach.do?pk=" + value;
										texttype = "2";
									} else
									if (username != null && !username.equalsIgnoreCase(""))
										value = username;
									else
										value = userid;
								} else
								if (dw_colname.equalsIgnoreCase("subject"))
									value = subject != null ? subject : "";
								else
								if (dw_colname.equalsIgnoreCase("create_date"))
								{
									value = create_date != null ? create_date : "";
									if (!value.equalsIgnoreCase(""))
										try
										{
											value = (new SimpleDateFormat("yyyy年MM月dd日")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(value));
										}
										catch (ParseException e1)
										{
											e1.printStackTrace();
										}
								}
								if (value.equalsIgnoreCase(""))
									value = " ";
								Element el = new Element("bookmark");
								Element tmpel = buildNode("name", bookmark);
								el.addContent(tmpel);
								tmpel = buildNode("type", texttype);
								el.addContent(tmpel);
								tmpel = buildNode("value", value);
								el.addContent(tmpel);
								lczbNode.addContent(el);
							}
						}

					}
				}
				String xml = new String(outputToString(backDoc, "GBK").getBytes("GBK"), "ISO-8859-1");
				response.setContentType("text/xml");
				sendXmlBack(xml, response);
				destroyConnection();
				return;
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowPrintSet2"))
		{
			Document backDoc = new Document(new Element("root"));
			Document gridset = loadRequest1(request, response);
			String rowid = gridset.getRootElement().getChildText("rowid");
			java.util.List gridnodes = gridset.getRootElement().getChild("dbnetgrids").getChildren();
			String sql = "";
			rtn = "";
			String flow_code = "";
			String flow_id = "";
			try
			{
				sql = "select flow_code, id from flow_log_master where retrieve_condition = ? and flow_state = 1";
				PreparedStatement pstmt = con.prepareStatement(sql);
				pstmt.setString(1, rowid);
				rs = pstmt.executeQuery();
				if (rs.next())
				{
					flow_code = rs.getString("flow_code");
					flow_id = rs.getString("id");
				}
				pstmt.close();
				sql = "select data_type,flow_step,dw_colname,file_bookmarks,is_numbertochina,data_grid,data_repeat from flow_print where flow_code = '" + flow_code + "' and data_type <> 3 order by data_type,data_grid,bh,flow_step";
				rs = stmt.executeQuery(sql);
				java.util.List list = new ArrayList();
				java.util.List listzb = new ArrayList();
				java.util.List listxb = new ArrayList();
				java.util.List listlc = new ArrayList();
				String lastflag = "";
				java.util.List tmp = null;
				HashMap hmap = new HashMap();
				while (rs.next()) 
				{
					java.util.List el = new ArrayList();
					el.add(rs.getString("file_bookmarks"));
					el.add(rs.getString("flow_step") != null ? ((Object) (rs.getString("flow_step"))) : "");
					el.add(rs.getString("dw_colname") != null ? ((Object) (rs.getString("dw_colname"))) : "");
					el.add(rs.getString("is_numbertochina") != null ? ((Object) (rs.getString("is_numbertochina"))) : "0");
					el.add(rs.getString("data_grid") != null ? ((Object) (rs.getString("data_grid"))) : "");
					el.add(rs.getString("data_repeat") != null ? ((Object) (rs.getString("data_repeat"))) : "0");
					String datatype = rs.getString("data_type");
					if (datatype.equalsIgnoreCase("1"))
						listzb.add(el);
					else
					if (datatype.equalsIgnoreCase("3"))
					{
						if (!rs.getString("data_grid").equalsIgnoreCase(lastflag))
						{
							if (tmp != null)
								listxb.add(tmp);
							tmp = new ArrayList();
							lastflag = rs.getString("data_grid");
						}
						tmp.add(el);
					} else
					if (datatype.equalsIgnoreCase("2"))
						listlc.add(el);
				}
				if (tmp != null)
					listxb.add(tmp);
				sql = "select flow_log_detail.setp_code setp_code,flow_log_detail.signature signature,flow_log_detail.opinion opinion,user_list.file_lsh file_lsh, flow_log_detail.datetime dt from flow_log_detail,user_list where flow_log_detail.signature = user_list.code(+) and flow_log_detail.id = '" + flow_id + "'";
				java.util.List ele;
				for (rs = stmt.executeQuery(sql); rs.next(); hmap.put(rs.getString("setp_code"), ele))
				{
					ele = new ArrayList();
					ele.add(rs.getString("signature") != null ? ((Object) (rs.getString("signature"))) : "");
					ele.add(rs.getString("opinion") != null ? ((Object) (rs.getString("opinion"))) : "");
					ele.add(rs.getString("file_lsh") != null ? ((Object) (rs.getString("file_lsh"))) : "");
					ele.add(rs.getString("dt") != null ? ((Object) (rs.getString("dt"))) : "");
				}

				if (listzb.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("zb"));
					Element zbNode = backDoc.getRootElement().getChild("zb");
					String gridid = ((java.util.List)listzb.get(0)).get(4).toString();
					java.util.List lookups = null;
					for (int i = 0; i < gridnodes.size(); i++)
					{
						Element node = (Element)gridnodes.get(i);
						if (!node.getAttributeValue("id").equalsIgnoreCase(gridid))
							continue;
						sql = node.getChildText("sql");
						lookups = node.getChild("lookups").getChildren();
						break;
					}

					if (sql.toLowerCase().indexOf("where") != -1)
						sql = sql.substring(0, sql.toLowerCase().indexOf("where") + 5) + " ( " + rowid + " ) and " + sql.substring(sql.toLowerCase().indexOf("where") + 5);
					rs = stmt.executeQuery(sql);
					if (rs.next())
					{
						for (int i = 0; i < listzb.size(); i++)
						{
							String bookmark = (String)((java.util.List)listzb.get(i)).get(0);
							String flow_step = (String)((java.util.List)listzb.get(i)).get(1);
							String dw_colname = (String)((java.util.List)listzb.get(i)).get(2);
							String is_numbertochina = (String)((java.util.List)listzb.get(i)).get(3);
							String data_repeat = (String)((java.util.List)listzb.get(i)).get(5);
							Element lookup = null;
							if (lookups.size() > 0)
							{
								for (int j = 0; j < lookups.size(); j++)
								{
									if (!((Element)lookups.get(j)).getAttributeValue("col").equalsIgnoreCase(dw_colname))
										continue;
									lookup = (Element)lookups.get(j);
									break;
								}

							}
							if (dw_colname.indexOf(".") != -1)
								dw_colname = dw_colname.substring(dw_colname.indexOf(".") + 1);
							String value = rs.getString(dw_colname);
							if (is_numbertochina.equalsIgnoreCase("1"))
								value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
							value = value != null ? value : "";
							if (lookup != null && !value.equalsIgnoreCase(""))
							{
								String ic = lookup.getAttributeValue("ic");
								String dc = lookup.getAttributeValue("dc");
								String tn = lookup.getAttributeValue("tn");
								String filter = lookup.getChildText("filter");
								StringBuffer sb = new StringBuffer();
								sb.append("select ");
								sb.append(dc);
								sb.append(" from ");
								sb.append(tn);
								sb.append(" where ");
								sb.append(ic);
								sb.append(" = '");
								sb.append(value);
								sb.append("'");
								String sqltext = sb.toString();
								Statement stm = con.createStatement();
								ResultSet r = stm.executeQuery(sqltext);
								if (r.next())
								{
									String des = r.getString(dc);
									if (!des.equalsIgnoreCase("") && !des.equalsIgnoreCase("null"))
										value = des;
								}
								stm.close();
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", "1");
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							zbNode.addContent(el);
						}

					}
				}
				listxb.size();
				if (listlc.size() > 0)
				{
					backDoc.getRootElement().addContent(new Element("lc"));
					Element lcNode = backDoc.getRootElement().getChild("lc");
					for (int i = 0; i < listlc.size(); i++)
					{
						String bookmark = (String)((java.util.List)listlc.get(i)).get(0);
						String flow_step = (String)((java.util.List)listlc.get(i)).get(1);
						String dw_colname = (String)((java.util.List)listlc.get(i)).get(2);
						String is_numbertochina = (String)((java.util.List)listlc.get(i)).get(3);
						String data_repeat = (String)((java.util.List)listlc.get(i)).get(5);
						java.util.List val = (java.util.List)hmap.get(flow_step);
						if (val != null)
						{
							String signature = (String)val.get(0);
							String opinion = (String)val.get(1);
							String file_lsh = (String)val.get(2);
							String datetime = (String)val.get(3);
							String value = "";
							String texttype = "1";
							if (dw_colname.equalsIgnoreCase("signature"))
							{
								if (file_lsh != null && !file_lsh.equalsIgnoreCase(""))
								{
									value = file_lsh;
									value = "/pmis/file/attach.do?pk=" + value;
									texttype = "2";
								} else
								{
									value = signature;
								}
							} else
							if (dw_colname.equalsIgnoreCase("opinion"))
								value = opinion != null ? opinion : "";
							else
							if (dw_colname.equalsIgnoreCase("datetime"))
							{
								value = datetime != null ? datetime : "";
								if (!value.equalsIgnoreCase(""))
									try
									{
										value = (new SimpleDateFormat("yyyy年MM月dd日")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(value));
									}
									catch (ParseException e1)
									{
										e1.printStackTrace();
									}
							}
							if (value.equalsIgnoreCase(""))
								value = " ";
							Element el = new Element("bookmark");
							Element tmpel = buildNode("name", bookmark);
							el.addContent(tmpel);
							tmpel = buildNode("type", texttype);
							el.addContent(tmpel);
							tmpel = buildNode("value", value);
							el.addContent(tmpel);
							lcNode.addContent(el);
						}
					}

				}
				String xml = new String(outputToString(backDoc, "GBK").getBytes("GBK"), "ISO-8859-1");
				response.setContentType("text/xml");
				sendXmlBack(xml, response);
				destroyConnection();
				return;
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowPrintSet"))
		{
			String param = loadRequest(request, response);
			String flow_code = param.split("`")[0];
			String flow_id = param.split("`")[1];
			String sql = "";
			rtn = "";
			try
			{
				sql = "select data_type,flow_step,dw_colname,file_bookmarks,is_numbertochina from flow_print where flow_code = '" + flow_code + "' order by bh,flow_step";
				rs = stmt.executeQuery(sql);
				java.util.List list = new ArrayList();
				HashMap hmap = new HashMap();
				java.util.List el;
				for (; rs.next(); list.add(el))
				{
					el = new ArrayList();
					el.add(rs.getString("file_bookmarks"));
					el.add(rs.getString("data_type"));
					el.add(rs.getString("flow_step") != null ? ((Object) (rs.getString("flow_step"))) : "");
					el.add(rs.getString("dw_colname") != null ? ((Object) (rs.getString("dw_colname"))) : "");
					el.add(rs.getString("is_numbertochina") != null ? ((Object) (rs.getString("is_numbertochina"))) : "0");
				}

				sql = "select flow_log_detail.setp_code setp_code,flow_log_detail.signature signature,flow_log_detail.opinion opinion,user_list.file_lsh file_lsh, flow_log_detail.datetime dt from flow_log_detail,user_list where flow_log_detail.signature = user_list.code(+) and flow_log_detail.id = '" + flow_id + "'";
				java.util.List ele;
				for (rs = stmt.executeQuery(sql); rs.next(); hmap.put(rs.getString("setp_code"), ele))
				{
					ele = new ArrayList();
					ele.add(rs.getString("signature") != null ? ((Object) (rs.getString("signature"))) : "");
					ele.add(rs.getString("opinion") != null ? ((Object) (rs.getString("opinion"))) : "");
					ele.add(rs.getString("file_lsh") != null ? ((Object) (rs.getString("file_lsh"))) : "");
					ele.add(rs.getString("dt") != null ? ((Object) (rs.getString("dt"))) : "");
				}

				CallableStatement cstmt = null;
				cstmt = con.prepareCall("{? = call pkg_flow.getupdateparentwheresql(?,?) }");
				cstmt.registerOutParameter(1, 12);
				cstmt.setString(2, flow_code);
				cstmt.setString(3, flow_id);
				cstmt.execute();
				String ls_where = cstmt.getString(1);
				ls_where = ls_where.substring(7);
				cstmt.close();
				sql = "select dw_name from flow_master where flow_code = '" + flow_code + "'";
				rs = stmt.executeQuery(sql);
				if (rs.next())
				{
					String tableName = rs.getString("dw_name");
					if (tableName != null && !tableName.equalsIgnoreCase(""))
					{
						sql = "select * from " + tableName + " where " + ls_where;
						rs = stmt.executeQuery(sql);
						if (rs.next())
						{
							for (int i = 0; i < list.size(); i++)
							{
								String bookmark = (String)((java.util.List)list.get(i)).get(0);
								String data_type = (String)((java.util.List)list.get(i)).get(1);
								String flow_step = (String)((java.util.List)list.get(i)).get(2);
								String dw_colname = (String)((java.util.List)list.get(i)).get(3);
								String is_numbertochina = (String)((java.util.List)list.get(i)).get(4);
								if (data_type.equalsIgnoreCase("1"))
								{
									if (dw_colname != null && !dw_colname.equalsIgnoreCase(""))
									{
										String value = rs.getString(dw_colname);
										if (is_numbertochina.equalsIgnoreCase("1"))
											value = UtilTool.DoNumberCurrencyToChineseCurrency(new BigDecimal(value != null ? value : "0"));
										value = value != null ? value : "";
										rtn = rtn + bookmark + "`" + value + "`1" + "^";
									}
								} else
								if (data_type.equalsIgnoreCase("2") && dw_colname != null && !dw_colname.equalsIgnoreCase(""))
								{
									String value = "";
									java.util.List val = (java.util.List)hmap.get(flow_step);
									if (val != null)
									{
										String signature = (String)val.get(0);
										String opinion = (String)val.get(1);
										String file_lsh = (String)val.get(2);
										String datetime = (String)val.get(3);
										if (dw_colname.equalsIgnoreCase("signature"))
										{
											if (file_lsh != null && !file_lsh.equalsIgnoreCase(""))
											{
												value = file_lsh;
												rtn = rtn + bookmark + "`/pmis/file/attach.do?pk=" + value + "`2" + "^";
											} else
											{
												value = signature;
												rtn = rtn + bookmark + "`" + value + "`1" + "^";
											}
										} else
										if (dw_colname.equalsIgnoreCase("opinion"))
										{
											value = opinion != null ? opinion : "";
											rtn = rtn + bookmark + "`" + value + "`1" + "^";
										} else
										if (dw_colname.equalsIgnoreCase("datetime"))
										{
											value = datetime != null ? datetime : "";
											if (!value.equalsIgnoreCase(""))
												try
												{
													value = (new SimpleDateFormat("yyyy年MM月dd日")).format((new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")).parse(value));
												}
												catch (ParseException e1)
												{
													e1.printStackTrace();
												}
											rtn = rtn + bookmark + "`" + value + "`1" + "^";
										}
									}
								}
							}

							if (!rtn.equalsIgnoreCase("") && rtn.length() > 0)
								rtn = rtn.substring(0, rtn.length() - 1);
						}
					}
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getQueryFilter"))
		{
			String param = loadRequest(request, response);
			String lvl = param.split("`")[0];
			String str = param.split("`")[1];
			String sql = "";
			rtn = "";
			try
			{
				if (lvl.equalsIgnoreCase("2"))
				{
					sql = "select group_user.userid,group_user.groupid,group_list.is_con from group_user,group_list where group_user.groupid = group_List.groupid and is_con = " + str;
					for (rs = stmt.executeQuery(sql); rs.next();)
						if (rtn.equalsIgnoreCase(""))
							rtn = " FLOW_LOG_MASTER.userid = '" + rs.getString("userid") + "'";
						else
							rtn = rtn + " or FLOW_LOG_MASTER.userid = '" + rs.getString("userid") + "'";

					if (rtn.equalsIgnoreCase(""))
						rtn = "1=2";
				} else
				if (lvl.equalsIgnoreCase("3"))
				{
					sql = "select group_user.userid,group_user.groupid,group_list.is_con from group_user,group_list where group_user.groupid = group_List.groupid and substr(group_user.groupid,0,length('" + str + "')) = '" + str + "'";
					for (rs = stmt.executeQuery(sql); rs.next();)
						if (rtn.equalsIgnoreCase(""))
							rtn = " FLOW_LOG_MASTER.userid = '" + rs.getString("userid") + "'";
						else
							rtn = rtn + " or FLOW_LOG_MASTER.userid = '" + rs.getString("userid") + "'";

					if (rtn.equalsIgnoreCase(""))
						rtn = "1=2";
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowSettingMaster"))
		{
			String param = loadRequest(request, response);
			String fun_code = param;
			String sql = "";
			sql = "select name from flow_dw where id = '" + fun_code + "' and ismaster = 1";
			try
			{
				rs = stmt.executeQuery(sql);
				rtn = "";
				if (rs.next())
					rtn = rs.getString("name");
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFlowSetting"))
		{
			String param = loadRequest(request, response);
			String fun_code = param;
			String sql = "";
			sql = "select name from flow_dw where id = '" + fun_code + "' order by nvl(ismaster,0) desc,bh asc";
			try
			{
				rs = stmt.executeQuery(sql);
				for (rtn = ""; rs.next(); rtn = rtn + rs.getString("name") + "`");
				if (rtn.length() > 0)
					rtn = rtn.substring(0, rtn.length() - 1);
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getFunPrintSetting"))
		{
			String param = loadRequest(request, response);
			String fun_code = param;
			String sql = "";
			sql = "select name from fun_print_dw where id = '" + fun_code + "' order by nvl(ismaster,0) desc,bh asc";
			try
			{
				rs = stmt.executeQuery(sql);
				for (rtn = ""; rs.next(); rtn = rtn + rs.getString("name") + "`");
				if (rtn.length() > 0)
					rtn = rtn.substring(0, rtn.length() - 1);
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getDefinedFlows"))
		{
			String param = loadRequest(request, response);
			String fun_code = param;
			String sql = "";
			sql = "select flow_master.flow_code,flow_master.flow_name,flow_master.dw_name,flow_master.fun_code,flow_master.is_template,flow_master.in_file,flow_master.bm,flow_master.wjbh_column,flow_master.wjcltm_column,flow_master.is_maste_detail,flow_master.is_print,flow_master.file_lsh,flow_canmodify_v.is_modify,0 co_new from flow_master,flow_canmodify_v where ( flow_master.flow_code = flow_canmodify_v.flow_code (+)) and (flow_master.is_template = 1) and ( flow_master.fun_code = '" + fun_code + "')";
			try
			{
				rs = stmt.executeQuery(sql);
				rtn = "";
				while (rs.next()) 
					if (rtn.equalsIgnoreCase(""))
						rtn = rtn + rs.getString("flow_code") + "`" + rs.getString("flow_name") + "`" + rs.getString("dw_name") + "`" + rs.getString("fun_code") + "`" + rs.getString("is_template") + "`" + rs.getString("in_file") + "`" + rs.getString("bm") + "`" + rs.getString("wjbh_column") + "`" + rs.getString("wjcltm_column") + "`" + rs.getString("is_maste_detail") + "`" + rs.getString("is_print") + "`" + rs.getString("file_lsh") + "`" + rs.getString("is_modify") + "`" + rs.getString("co_new");
					else
						rtn = rtn + "^" + rs.getString("flow_code") + "`" + rs.getString("flow_name") + "`" + rs.getString("dw_name") + "`" + rs.getString("fun_code") + "`" + rs.getString("is_template") + "`" + rs.getString("in_file") + "`" + rs.getString("bm") + "`" + rs.getString("wjbh_column") + "`" + rs.getString("wjcltm_column") + "`" + rs.getString("is_maste_detail") + "`" + rs.getString("is_print") + "`" + rs.getString("file_lsh") + "`" + rs.getString("is_modify") + "`" + rs.getString("co_new");
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("getGroupList"))
		{
			String param = loadRequest(request, response);
			String table = param;
			String sql = "";
			sql = "select group_list.groupid,group_list.notes,length(group_list.groupid) length from group_list,group_notes_view where ( group_list.groupid = group_notes_view.groupid (+))  union select rolescode groupid, rolesname length, 3 length from ws_rolesmsg_view order by 1 asc";
			try
			{
				System.out.println(sql);
				rs = stmt.executeQuery(sql);
				rtn = "";
				while (rs.next()) 
				{
					String space = "|";
					for (int i = 1; i < rs.getInt("length") - 1; i++)
						space = space + "----";

					if (rtn.equalsIgnoreCase(""))
						rtn = rtn + rs.getString("groupid") + "`" + space + rs.getString("notes");
					else
						rtn = rtn + "^" + rs.getString("groupid") + "`" + space + rs.getString("notes");
				}
			}
			catch (SQLException e)
			{
				e.printStackTrace();
			}
		}
		if (method.equalsIgnoreCase("createFlow"))
		{
			String sql = "";
			boolean state = true;
			rtn = "OK";
			Document xmlDoc = loadRequest1(request, response);
			Element root = xmlDoc.getRootElement();
			if (state)
			{
				Element flow_master = root.getChild("flow_master");
				for (int i = 0; i < flow_master.getChildren().size(); i++)
				{
					Element row = (Element)flow_master.getChildren().get(i);
					String flow_code = row.getChild("flow_code").getValue();
					String flow_name = row.getChild("flow_name").getValue();
					String dw_name = row.getChild("dw_name").getValue();
					String fun_code = row.getChild("fun_code").getValue();
					String is_template = row.getChild("is_template").getValue();
					sql = "insert into flow_master(flow_code,flow_name,dw_name,fun_code,is_template) values('" + flow_code + "','" + flow_name + "','" + dw_name + "','" + fun_code + "'," + is_template + ")";
					try
					{
						stmt.executeUpdate(sql);
						continue;
					}
					catch (SQLException e)
					{
						e.printStackTrace();
						rtn = "创建流程失败！";
						state = false;
					}
					break;
				}

			}
			if (state)
			{
				Element flow_detail = root.getChild("flow_detail");
				for (int i = 0; i < flow_detail.getChildren().size(); i++)
				{
					Element row = (Element)flow_detail.getChildren().get(i);
					String flow_code = row.getChild("flow_code").getValue();
					String flow_detail_id = row.getChild("flow_detail_id").getValue();
					String dw_detail = row.getChild("dw_detail").getValue();
					String dw_detail_name = row.getChild("dw_detail_name").getValue();
					sql = "insert into flow_detail(flow_code,flow_detail_id,dw_detail,dw_detail_name) values('" + flow_code + "'," + flow_detail_id + ",'" + dw_detail + "','" + dw_detail_name + "')";
					try
					{
						stmt.executeUpdate(sql);
						continue;
					}
					catch (SQLException e)
					{
						e.printStackTrace();
						rtn = "创建流程失败！";
						state = false;
					}
					break;
				}

			}
		}
		if (method.equalsIgnoreCase("deleteFlow"))
		{
			String param = loadRequest(request, response);
			String flow_code = param;
			String sql = "";
			try
			{
				sql = "delete from flow_print where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_condition_exp where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_activity where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_signature where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_step_detwriteable where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_step_writeable where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_step where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_detail where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				sql = "delete from flow_master where flow_code = '" + flow_code + "'";
				stmt.executeUpdate(sql);
				rtn = "删除流程成功！";
			}
			catch (SQLException e)
			{
				e.printStackTrace();
				rtn = "删除流程失败！";
			}
		}
		String xml = "<?xml version=\"1.0\" encoding=\"GBK\"?>";
		xml = xml + "<root><![CDATA[" + rtn;
		xml = xml + "]]></root>";
		xml = new String(xml.getBytes("GBK"), "ISO-8859-1");
		response.setContentType("text/xml");
		sendXmlBack(xml, response);
		destroyConnection();
	}

	private Document buildFromXMLString(String xmlString)
		throws IOException, JDOMException
	{
		try
		{
			SAXBuilder builder = new SAXBuilder();
			Document anotherDocument = builder.build(new StringReader(xmlString));
			return anotherDocument;
		}
		catch (JDOMException e)
		{
			e.printStackTrace();
		}
		catch (NullPointerException e)
		{
			e.printStackTrace();
		}
		return null;
	}

	private void sendXmlBack(String xmlString, HttpServletResponse response)
		throws IOException
	{
		try
		{
			Document xmlBack = buildFromXMLString(xmlString);
			response.setContentType("text/xml");
			PrintWriter out = response.getWriter();
			Format ft = Format.getRawFormat();
			ft.setEncoding("GBK");
			XMLOutputter outt = new XMLOutputter(ft);
			outt.output(xmlBack, out);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	private String outputToString(Object obj, String encoding)
	{
		String xml = "";
		Format format = Format.getRawFormat();
		format.setEncoding(encoding);
		XMLOutputter xmlOut = new XMLOutputter(format);
		if (obj instanceof Document)
			xml = xmlOut.outputString((Document)obj);
		else
		if (obj instanceof Element)
			xml = xmlOut.outputString((Element)obj);
		else
		if (obj instanceof CDATA)
			xml = xmlOut.outputString((CDATA)obj);
		else
		if (obj instanceof DocType)
			xml = xmlOut.outputString((DocType)obj);
		else
		if (obj instanceof Comment)
			xml = xmlOut.outputString((Comment)obj);
		else
		if (obj instanceof Text)
			xml = xmlOut.outputString((Text)obj);
		else
		if (obj instanceof EntityRef)
			xml = xmlOut.outputString((EntityRef)obj);
		else
		if (obj instanceof ProcessingInstruction)
			xml = xmlOut.outputString((ProcessingInstruction)obj);
		return xml;
	}

	private Element buildNode(String name, String value)
	{
		Element el = new Element(name);
		el.addContent(new CDATA(value));
		return el;
	}

	private Object getFlowConfigCellsObj(String flowcode)
	{
		java.util.List nodelist = new ArrayList();
		java.util.List transitionlist = new ArrayList();
		java.util.List list = new ArrayList();
		list.add(nodelist);
		list.add(transitionlist);
		return list;
	}

	private Object getFlowTaskCellsObj(String flowid)
	{
		java.util.List tasklist = new ArrayList();
		try
		{
			String sql = "select setp_code from flow_log_detail where id = '" + flowid + "' and sending = 0";
			for (rs = stmt.executeQuery(sql); rs.next(); tasklist.add(rs.getString(1)));
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		return tasklist;
	}

	static 
	{
		logger = Logger.getLogger(com.sgepit.frame.flow.control.FlowGetUtilServlet.class);
	}
}
