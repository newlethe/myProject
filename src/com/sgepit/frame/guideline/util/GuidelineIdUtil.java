/**
 * Central China Technology Development of Electric Power Company LTD.
 * @author: Shirley's
 * @version: 2009
 *
 *
 */

package com.sgepit.frame.guideline.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;


/**
 * {class description}
 * @author Shirley's
 * @createDate Apr 7, 2009
 **/
public class GuidelineIdUtil {
	
	public static String newGuidelineId(String parentId){
		String id = "";
		String newParentId = (parentId.equals("d")?"":parentId);
		try{
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			
			StringBuffer buf = new StringBuffer();
			buf.append("select max(zb_seqno) as max from(");
			buf.append("select zb_seqno from sgcc_guideline_info where parentid='")
					.append(parentId).append("' and zb_seqno like '")
					.append(newParentId).append("%'");
			buf.append(")");
			
			PreparedStatement st = conn.prepareStatement(buf.toString());
			ResultSet rs = st.executeQuery();
			
			if(rs.next()&&rs.getObject(1)!=null){
				if(parentId.equals("d")){
					id = String.format("%03d", rs.getLong(1)+1);
				}else{
					String len = String.valueOf(parentId.length()+3);
					String format = "%0"+len+"d";
					id = String.format(format, rs.getLong(1)+1);
				}
			}else{
				if(parentId.equals("d")){
					id = "001";
				}else{
					id = parentId+"001";
				}
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}
}
