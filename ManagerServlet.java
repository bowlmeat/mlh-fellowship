package com.banksystem.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.naming.directory.SearchControls;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.banksystem.entity.Loan;
import com.banksystem.entity.LoanScheme;
import com.banksystem.entity.Manager;
import com.banksystem.service.ManagerService;
import com.banksystem.service.impl.ManagerServiceImpl;
import com.banksystem.service.impl.UserServiceimpl;
import com.alibaba.fastjson.JSON;


@WebServlet("/ManagerServlet")
public class ManagerServlet extends HttpServlet {

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		//set character encoding to solve messy code
		req.setCharacterEncoding("utf-8");
		String method = req.getParameter("method");	
		
		//call the corresponding function  
		if ("login".equals(method)) {              
			login(req, resp);			
		} else if ("loginOut".equals(method)) {       
			LoginOut(req, resp);
		} else if ("selectAllLoans".equals(method)) {
			selectAllLoans(req, resp);
		}else if("selectRLoans".equals(method)) {
			selectRLoans(req, resp);
		}else if ("PassLoan".equals(method)) {
			PassLoan(req, resp);
		} else if ("RejectLoan".equals(method)) {
			RejectLoan(req, resp);
		}else if("QuOneLs".equals(method)) {     
			QuOneLs(req,resp);
			
			
			}
	}

	/********************** login ******************/
	protected void login(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		String userid = null;
		String pswd = null;
		
		// get the input data
		userid = req.getParameter("userid");
		pswd = req.getParameter("pswd");
		
		//call the encapsulated logical layer function
		ManagerService managers = new ManagerServiceImpl();
		Manager manager=null;
		
		try {
			//pass parameters from the html page
			manager = managers.ManagerLogin(userid, pswd);
			
			if (manager != null) {
				//get user information from session and don't need to get access to the date through database
				// get the session object
				HttpSession session = req.getSession();
				//store the value into session
				session.setAttribute("manager", manager);

				//direct to the corresponding  manager-main page
				resp.sendRedirect("m-main.html");
			
				return;
			} else {
				//direct to the corresponding login pages
				req.setAttribute("msg", "input error!");
				req.getRequestDispatcher("login.html").forward(req, resp);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/********************** loginout ****************/
	protected void LoginOut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		//log out the session object
		req.getSession().invalidate();

		// direct to the corresponding login pages
		resp.sendRedirect(req.getContextPath() + "login.html");
	}

	/****** check all outstanding records  *********/
	protected void selectAllLoans(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		Manager manager=(Manager) req.getSession().getAttribute("manager");
		
		String selfbankname=manager.getBankname();	
		
		ManagerService managerService= new ManagerServiceImpl();
		List<Loan> loans = null;
		try {
			//call logical function and return the records in List format
			loans = managerService.selectAllLoans(selfbankname);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		// transfer data in json format 	
		sendMsgToHTMLWithFastJson(resp, loans);
		
		return;
		
	}
	
	/****** check a single record through loanID *********/
	protected void QuOneLs(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		req.setCharacterEncoding("utf-8");
      	String loanID = req.getParameter("loanID");
		
		UserServiceimpl users = new UserServiceimpl();
		LoanScheme ls=null;
		try {
			 ls= users.UserquloanByloanID(loanID);	
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//call function to convert the data into json format 
		sendMsgToHTMLWithFastJson(resp, ls);
		
		return;
	}
	
	
	/******* query pending records ******/
	protected void selectRLoans(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Manager manager=(Manager) req.getSession().getAttribute("manager");
		String selfbankname=manager.getBankname();
		
		ManagerService managerService= new ManagerServiceImpl();
		List<Loan> rloans = null;
		try {
			rloans = managerService.selectRLoans(selfbankname);
		} catch (Exception e) {
			e.printStackTrace();
		}
	
	}

	/******* pass the loan **********/
	protected void PassLoan(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		String loanID = req.getParameter("loanID");

		int status = 1;   //1: pass
		int update = -1;   //init as pass operation error
		ManagerService manager = new ManagerServiceImpl();

		try {
			update = manager.CheckLoan(loanID, status);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (update > 0) //the update is successful
		{
			System.out.println("sucess" + status);
		} else {		
			req.setAttribute("msg", "error");
		}
		
		//return the corresponding data
		sendMsgToHTMLWithFastJson(resp, update);
		
	}

	/****** loan rejection **********/
	protected void RejectLoan(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String loanID = req.getParameter("loanID");
		
		int status = 2;  //2:reject
		int update = -1;  //init as reject operation error
		ManagerService manager = new ManagerServiceImpl();

		try {
			update = manager.CheckLoan(loanID, status);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if (update > 0)  //the update is successful
		{
			System.out.println("success" + status);
		} else {
			req.setAttribute("msg", "error");
		}
		
		//return the corresponding data
		sendMsgToHTMLWithFastJson(resp, update);
	}
	
	/****** convert data into json format and render it on the front-end page *******/
	private void sendMsgToHTMLWithFastJson(HttpServletResponse resp, Object obj) throws ServletException, IOException {

		String msg = JSON.toJSONString(obj);
		System.out.println(msg);
		resp.setContentType("json/application;charset=UTF-8");
		resp.getWriter().write(msg);
		
		return;
	}
	

}
